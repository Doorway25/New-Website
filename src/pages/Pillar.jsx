import { Link, useLocation } from "react-router-dom";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import PageHero from "../components/PageHero";
import CounsellingSection from "../components/CounsellingSection";
import SeoHead from "../components/SeoHead";
import { useSite } from "../api/SiteContext";

export default function Pillar() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/+/, "");
  const { pillars, pillarBySlug } = useSite();
  const pillar = pillarBySlug[slug];

  if (!pillar) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Page not found</h1>
        <p className="mt-3 text-slate-500">The page you're looking for doesn't exist.</p>
        <Link to="/about-us" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          Back to About Us
        </Link>
      </div>
    );
  }

  const others = pillars.filter((p) => p.slug !== pillar.slug);

  return (
    <>
      <SeoHead
        seo={pillar}
        title={`${pillar.title} | Education Doorway`}
        description={pillar.short}
        path={`/${pillar.slug}`}
      />
      <PageHero
        eyebrow={pillar.eyebrow}
        title={pillar.title}
        subtitle={pillar.short}
        crumbs={[{ label: "About Us", to: "/about-us" }, { label: pillar.title }]}
      />

      {/* Intro */}
      <section className="container-x -mt-8 relative z-10">
        <Reveal className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-brand-950/5 sm:p-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/30">
            <Icon name={pillar.icon} className="h-7 w-7" />
          </span>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600">{pillar.intro}</p>
        </Reveal>
      </section>

      {/* Points */}
      <section className="container-x py-14">
        <div className="grid gap-5 sm:grid-cols-2">
          {pillar.points.map((pt, i) => (
            <Reveal key={pt.title} delay={(i % 2) * 80}>
              <div className="flex h-full items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name={pt.icon} className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">{pt.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{pt.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Explore the others */}
      <section className="container-x pb-16">
        <h2 className="font-display text-2xl font-bold text-ink">Explore More</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {others.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 80}>
              <Link
                to={`/${p.slug}`}
                className="group flex h-full items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Icon name={p.icon} className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink group-hover:text-brand-700">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{p.short}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-transform group-hover:translate-x-0.5">
                    Learn more <Icon name="arrow" className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CounsellingSection />
    </>
  );
}
