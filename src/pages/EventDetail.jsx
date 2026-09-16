import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPublic, mediaUrl } from "../api/client";
import { useSite } from "../api/SiteContext";
import CounsellingSection from "../components/CounsellingSection";
import EventCard from "../components/EventCard";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import SeoHead from "../components/SeoHead";

function toParagraphs(value) {
  if (Array.isArray(value)) return value.map((p) => String(p || "").trim()).filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeEvent(item) {
  if (!item) return null;
  const description = toParagraphs(item.description);
  const excerpt = String(item.excerpt || "").trim();
  return {
    ...item,
    description,
    agenda: Array.isArray(item.agenda) ? item.agenda.filter(Boolean) : [],
    image: mediaUrl(item.image) || item.image,
    excerpt,
  };
}

export default function EventDetail() {
  const { slug } = useParams();
  const { company, eventBySlug, events, formatDate } = useSite();
  const preview = eventBySlug[slug];
  const [fullEvent, setFullEvent] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setFullEvent(null);
    setLoadError(false);

    fetchPublic(`/events/${encodeURIComponent(slug)}`)
      .then((item) => {
        if (cancelled || !item) return;
        setFullEvent(normalizeEvent(item));
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const event = useMemo(() => {
    if (fullEvent) return fullEvent;
    if (!preview) return null;
    return normalizeEvent(preview);
  }, [fullEvent, preview]);

  if (!preview && !fullEvent && !loadError) {
    return (
      <section className="container-x py-24 text-center">
        <p className="text-slate-500">Loading event…</p>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="container-x py-24 text-center">
        <h1 className="font-display text-3xl font-extrabold text-ink">Event not found</h1>
        <p className="mt-3 text-slate-500">The event you're looking for doesn't exist or has been moved.</p>
        <Link to="/events" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 font-semibold text-white">
          Back to Events <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </section>
    );
  }

  const online = event.type === "Online";
  const others = events.filter((e) => e.slug !== event.slug).slice(0, 3);
  const paragraphs =
    event.description?.length > 0
      ? event.description
      : event.excerpt
        ? [event.excerpt]
        : [];
  const agenda = Array.isArray(event.agenda) ? event.agenda : [];
  const contentLoading = !fullEvent && paragraphs.length === 0 && agenda.length === 0;

  return (
    <>
      <SeoHead
        seo={event}
        title={`${event.title} | Education Doorway`}
        description={paragraphs[0] || event.excerpt}
        image={event.image}
        path={`/events/${event.slug}`}
      />
      <section className="relative overflow-hidden bg-brand-950 pb-10 pt-14 sm:pb-12">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,rgba(0,178,255,.55),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(79,210,255,.3),transparent_40%)]" />
        <div className="container-x relative max-w-3xl">
          <nav className="flex items-center gap-1.5 text-sm text-slate-400">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <Icon name="chevron" className="h-4 w-4 -rotate-90 text-slate-500" />
            <Link to="/events" className="hover:text-white">
              Events
            </Link>
          </nav>
          <span
            className={`mt-5 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
              online ? "bg-emerald-500/20 text-emerald-300" : "bg-gold-500/15 text-gold-400"
            }`}
          >
            {event.type}
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            {event.title}
          </h1>
        </div>
      </section>

      <section className="container-x relative z-10 -mt-4 pb-8 sm:-mt-6">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-brand-950/5">
            {event.image ? (
              <div className="detail-hero-media">
                <img
                  src={event.image}
                  alt={event.title}
                  onError={(e) => {
                    e.currentTarget.closest(".detail-hero-media")?.classList.add("hidden");
                  }}
                  className="detail-hero-img"
                />
              </div>
            ) : null}
            <div className="p-6 sm:p-9">
              <h2 className="font-display text-xl font-bold text-ink">About this event</h2>
              <div className="mt-3 space-y-4 text-[15px] leading-relaxed text-slate-600">
                {contentLoading ? (
                  <p className="text-sm text-slate-400">Loading event details…</p>
                ) : paragraphs.length > 0 ? (
                  paragraphs.map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <p className="text-slate-500">Details for this event will be published soon.</p>
                )}
              </div>
              {agenda.length > 0 && (
                <>
                  <h3 className="mt-7 font-display text-lg font-bold text-ink">What to expect</h3>
                  <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {agenda.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-sm text-slate-600">
                        <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /> {a}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-brand-950/5">
              <h3 className="font-display text-lg font-bold text-ink">Event details</h3>
              <ul className="mt-4 space-y-4 text-sm">
                <Detail
                  icon="calendar"
                  label="Date"
                  value={formatDate(event.date, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                />
                <Detail icon="clock" label="Time" value={event.time} />
                <Detail icon="pin" label="Location" value={event.location} />
                <Detail icon="tag" label="Format" value={event.type} />
              </ul>
              <Link
                to="/apply-now"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:brightness-110"
              >
                Register Now <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <a
                href={company.whatsapp}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Icon name="whatsapp" className="h-4 w-4 text-emerald-500" /> Ask a question
              </a>
            </div>
          </aside>
        </div>

        <Link to="/events" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline">
          <Icon name="arrow" className="h-4 w-4 rotate-180" /> Back to all events
        </Link>
      </section>

      <section className="container-x pb-4">
        <h2 className="font-display text-2xl font-extrabold text-ink">More Events</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((e, i) => (
            <Reveal key={e.slug} delay={i * 70}>
              <EventCard event={e} />
            </Reveal>
          ))}
        </div>
      </section>

      <CounsellingSection />
    </>
  );
}

function Detail({ icon, label, value }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon name={icon} className="h-4.5 w-4.5" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="font-medium text-ink">{value}</p>
      </div>
    </li>
  );
}
