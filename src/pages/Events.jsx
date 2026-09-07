import { useState } from "react";
import CounsellingSection from "../components/CounsellingSection";
import EventCard from "../components/EventCard";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { useSite } from "../api/SiteContext";

const filters = ["All", "In-person", "Online"];

export default function Events() {
  const { events } = useSite();
  const [active, setActive] = useState("All");
  const list = active === "All" ? events : events.filter((e) => e.type === active);

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Upcoming Events & Webinars"
        subtitle="Join our education fairs, webinars and workshops to meet universities and get expert guidance."
        crumbs={[{ label: "Events" }]}
      />
      <section className="container-x -mt-8 relative z-10 pb-8">
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === f
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-500/25"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e, i) => (
            <Reveal key={e.slug} delay={(i % 3) * 70}>
              <EventCard event={e} />
            </Reveal>
          ))}
        </div>
      </section>
      <CounsellingSection />
    </>
  );
}
