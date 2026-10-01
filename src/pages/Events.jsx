import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CounsellingSection from "../components/CounsellingSection";
import EventCard from "../components/EventCard";
import AlbumPreviewCard from "../components/AlbumPreviewCard";
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
            <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album, i) => (
                <Reveal key={album.key} delay={(i % 3) * 70} className="min-w-0">
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

