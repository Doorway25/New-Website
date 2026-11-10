import { Link } from "react-router-dom";
import CounsellingSection from "../components/CounsellingSection";
import Flag from "../components/Flag";
import Icon from "../components/Icon";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SeoHead from "../components/SeoHead";
import { mediaUrl } from "../api/client";
import { useSite } from "../api/SiteContext";

export default function Countries() {
  const { countries, countUniversities, getPage } = useSite();
  const seoPage = getPage("countries");

  return (
    <>
      <SeoHead
        seo={seoPage}
        title="Study Destinations | Education Doorway"
        description="Explore top study destinations trusted by thousands of students every year."
        path="/countries"
      />
      <PageHero
        eyebrow={seoPage?.eyebrow || "Countries"}
        title={seoPage?.title || "View All Countries"}
        subtitle={
          seoPage?.subtitle ||
          "Explore top study destinations trusted by thousands of Bangladeshi students every year."
        }
        crumbs={[{ label: "Countries" }]}
      />
      <section className="container-x relative z-10 -mt-8 pb-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c, i) => {
            const count = countUniversities(c.slug);
            const cover = mediaUrl(c.imageUrl) || c.imageUrl || "";
            return (
              <Reveal key={c.slug} delay={(i % 3) * 70}>
                <Link
                  to={`/study/${c.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-950 to-brand-800">
                    {cover ? (
                      <img
                        src={cover}
                        alt={c.name}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-4 text-white sm:p-5">
                      <Flag code={c.code} className="h-10 w-10 shrink-0 drop-shadow sm:h-12 sm:w-12" title={c.name} />
                      <div className="min-w-0">
                        <h3 className="font-display text-lg font-bold leading-tight sm:text-xl">{c.name}</h3>
                        <span className="mt-1 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium text-gold-400 backdrop-blur">
                          {c.region}
                        </span>
                      </div>
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
