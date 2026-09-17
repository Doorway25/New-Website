import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CounsellingSection from "../components/CounsellingSection";
import EventCard from "../components/EventCard";
import Icon from "../components/Icon";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SeoHead from "../components/SeoHead";
import { useSite } from "../api/SiteContext";
import { splitEvents } from "../data/site";

const TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "gallery", label: "Gallery" },
];

const TAB_IDS = new Set(TABS.map((t) => t.id));

export default function Events() {
  const { events, eventAlbums, getPage } = useSite();
  const seoPage = getPage("events");
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const active = TAB_IDS.has(tabFromUrl) ? tabFromUrl : "upcoming";

  function setActive(id) {
    const next = {};
    if (id !== "upcoming") next.tab = id;
    setSearchParams(next, { replace: true });
  }

  const { upcoming, past } = useMemo(() => splitEvents(events), [events]);
  const albums = useMemo(
    () => (eventAlbums || []).filter((a) => Array.isArray(a.images) && a.images.length > 0),
    [eventAlbums]
  );

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
          subtitle: "Browse albums from Open Days, Assessment Days, Expos and more — open any album to see every photo.",
        }
      : active === "past"
        ? {
            title: "Past Events",
            subtitle: "Look back at our recent education fairs, webinars and campus sessions.",
          }
        : {
            title: seoPage?.title || "Upcoming Events & Webinars",
            subtitle:
              seoPage?.subtitle ||
              "Join our education fairs, webinars and workshops to meet universities and get expert guidance.",
          };

  return (
    <>
      <SeoHead
        seo={seoPage}
        title={
          active === "gallery"
            ? "Event Gallery | Education Doorway"
            : active === "past"
              ? "Past Events | Education Doorway"
              : "Events & Webinars | Education Doorway"
        }
        description={hero.subtitle}
        path={active === "upcoming" ? "/events" : `/events?tab=${active}`}
      />
      <PageHero
        eyebrow={seoPage?.eyebrow || "Events"}
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
          albums.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
              No gallery photos yet. Upload images under Admin → Event Gallery albums.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album, i) => (
                <Reveal key={album.key} delay={(i % 3) * 70}>
                  <AlbumPreviewCard album={album} />
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

      <CounsellingSection />
    </>
  );
}

function AlbumPreviewCard({ album }) {
  const cover = album.images?.[0];
  const count = album.images?.length || 0;

  return (
    <Link
      to={`/events/gallery/${encodeURIComponent(album.key)}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/15"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
        {cover ? (
          <img
            src={cover}
            alt={album.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-950" />
        )}
      </div>
      <div
        className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4"
        style={{ backgroundColor: "#0d157b" }}
      >
        <div className="min-w-0">
          <h2 className="truncate font-display text-lg font-bold text-white sm:text-xl">{album.name}</h2>
          <p className="mt-0.5 text-xs font-medium text-white/75">
            {count} photo{count === 1 ? "" : "s"}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-[#0d157b] shadow-lg transition group-hover:bg-gold-400 group-hover:text-brand-950">
          View all <Icon name="arrow" className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
