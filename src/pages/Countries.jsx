import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import Flag from "../components/Flag";
import Reveal from "../components/Reveal";
import PageHero from "../components/PageHero";
import CounsellingSection from "../components/CounsellingSection";
import { countries, countUniversities } from "../data/site";

export default function Countries() {
  return (
    <>
      <PageHero
        eyebrow="Countries"
        title="View All Countries"
        subtitle="Explore top study destinations trusted by thousands of Bangladeshi students every year."
        crumbs={[{ label: "Countries" }]}
      />
      <section className="container-x -mt-8 relative z-10 pb-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c, i) => {
            const count = countUniversities(c.slug);
            return (
              <Reveal key={c.slug} delay={(i % 3) * 70}>
                <Link
                  to={`/study/${c.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10"
                >
                  <div className="relative flex items-center gap-4 bg-gradient-to-br from-brand-950 to-brand-800 p-6 text-white">
                    <div className="pointer-events-none absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_80%_20%,white_1px,transparent_1px)] [background-size:18px_18px]" />
                    <Flag code={c.code} className="relative text-5xl drop-shadow" title={c.name} />
                    <div className="relative">
                      <h3 className="font-display text-lg font-bold leading-tight">{c.name}</h3>
                      <span className="mt-1 inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-gold-400">
                        {c.region}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex-1 text-sm leading-relaxed text-slate-500">{c.blurb}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                        <Icon name="cap" className="h-4 w-4 text-brand-500" />
                        {count} {count === 1 ? "University" : "Universities"}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-brand-600 transition-transform group-hover:translate-x-0.5">
                        Explore <Icon name="arrow" className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
      <CounsellingSection />
    </>
  );
}
