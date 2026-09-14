import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CounsellingSection from "../components/CounsellingSection";
import EventCard from "../components/EventCard";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { useSite } from "../api/SiteContext";
import { eventGalleryItems, splitEvents } from "../data/site";

const TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "gallery", label: "Gallery" },
];

const TAB_IDS = new Set(TABS.map((t) => t.id));

export default function Events() {
  const { events } = useSite();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  // Default tab = Upcoming
  const active = TAB_IDS.has(tabFromUrl) ? tabFromUrl : "upcoming";
  const [lightbox, setLightbox] = useState(null);

  function setActive(id) {
    setSearchParams(id === "upcoming" ? {} : { tab: id }, { replace: true });
  }

  const { upcoming, past } = useMemo(() => splitEvents(events), [events]);
  const gallery = useMemo(() => eventGalleryItems(events), [events]);

  const list = useMemo(() => {
    if (active === "upcoming") return upcoming;
    if (active === "past") return past;
    if (active === "gallery") return [];
    return upcoming;
  }, [active, upcoming, past]);

  const hero =
    active === "gallery"
      ? {
          title: "Event Gallery",
          subtitle: "Posters and photos from every Education Doorway fair, webinar and workshop.",
        }
      : active === "past"
        ? {
            title: "Past Events",
            subtitle: "Look back at our recent education fairs, webinars and campus sessions.",
          }
        : {
            title: "Upcoming Events & Webinars",
            subtitle: "Join our education fairs, webinars and workshops to meet universities and get expert guidance.",
          };

  return (
    <>
      <PageHero
        eyebrow="Events"
        title={hero.title}
        subtitle={hero.subtitle}
        crumbs={[{ label: "Events" }]}
      />
      <section className="container-x relative z-10 -mt-8 pb-10">
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === tab.id
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-500/25"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {active === "gallery" ? (
          gallery.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
              No gallery images yet. Add cover or gallery photos in the admin Events panel.
            </p>
          ) : (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {gallery.map((item, i) => (
                <Reveal key={item.key} delay={(i % 6) * 40} className="mb-4 break-inside-avoid">
                  <button
                    type="button"
                    onClick={() => setLightbox(item)}
                    className="group relative block w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg"
                  >
                    <img src={item.src} alt={item.title} loading="lazy" className="block w-full object-contain" />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/80 to-transparent px-3 pb-3 pt-10 text-left text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
                      {item.title}
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          )
        ) : list.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
            {active === "upcoming"
              ? "No upcoming events right now. Check the Past or Gallery tab."
              : "No events to show for this tab yet."}
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((e, i) => (
              <Reveal key={e.slug} delay={(i % 3) * 70}>
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {lightbox ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-950/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={lightbox.src} alt={lightbox.title} className="mx-auto max-h-[75vh] w-full object-contain" />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1">
              <p className="font-display text-lg font-bold text-ink">{lightbox.title}</p>
              <div className="flex gap-2">
                <Link
                  to={`/events/${lightbox.slug}`}
                  className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  View event
                </Link>
                <button
                  type="button"
                  onClick={() => setLightbox(null)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <CounsellingSection />
    </>
  );
}
