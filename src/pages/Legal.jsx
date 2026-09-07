import { Link, useLocation } from "react-router-dom";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SeoHead from "../components/SeoHead";
import { legalBySlug } from "../data/legal";
import NotFound from "./NotFound";

const related = [
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "terms-and-conditions", label: "Terms & Conditions" },
  { slug: "cookie-policy", label: "Cookie Policy" },
];

export default function Legal() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, "");
  const page = legalBySlug[slug];
  if (!page) return <NotFound />;

  return (
    <>
      <SeoHead
        title={`${page.title} | Education Doorway`}
        description={page.subtitle}
        path={page.path}
      />
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.subtitle}
        crumbs={[{ label: page.title }]}
      />

      <section className="container-x relative z-10 -mt-6 pb-16 sm:-mt-8">
        <Reveal className="mx-auto max-w-3xl rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-brand-950/5 sm:p-10">
          <p className="text-sm text-slate-500">
            Last updated: <span className="font-medium text-ink">{page.updated}</span>
          </p>

          <div className="mt-8 space-y-8">
            {page.sections.map((section) => (
              <article key={section.heading}>
                <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">{section.heading}</h2>
                {section.paragraphs?.map((p) => (
                  <p key={p.slice(0, 48)} className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {p}
                  </p>
                ))}
                {section.bullets?.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-slate-600 sm:text-base">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>

          <nav className="mt-10 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-6 text-sm">
            {related
              .filter((r) => r.slug !== slug)
              .map((r) => (
                <Link key={r.slug} to={`/${r.slug}`} className="font-semibold text-brand-600 hover:underline">
                  {r.label}
                </Link>
              ))}
            <Link to="/contact-us" className="font-semibold text-slate-500 hover:text-ink hover:underline">
              Contact us
            </Link>
          </nav>
        </Reveal>
      </section>
    </>
  );
}
