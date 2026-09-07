import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Icon from "../components/Icon";
import Flag from "../components/Flag";
import Reveal from "../components/Reveal";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import CounsellingSection from "../components/CounsellingSection";
import SeoHead from "../components/SeoHead";
import { useSite } from "../api/SiteContext";

const CONTACT_REGIONS = [
  { key: "uk", label: "United Kingdom", short: "UK", code: "gb", match: (b) => /united kingdom|uk/i.test(b.country || "") },
  { key: "bangladesh", label: "Bangladesh", short: "Bangladesh", code: "bd", match: (b) => /bangladesh/i.test(b.country || "") },
  { key: "pakistan", label: "Pakistan", short: "Pakistan", code: "pk", match: (b) => /pakistan/i.test(b.country || "") },
  { key: "nigeria", label: "Nigeria", short: "Nigeria", code: "ng", match: (b) => /nigeria/i.test(b.country || "") },
];

const REGION_BANNER = {
  uk: {
    label: "UK Students",
    title: "Your future starts with the right doorway",
    text: "From our London head office to branches worldwide — we guide students every step of the way.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&h=700&q=80",
  },
  bangladesh: {
    label: "Bangladesh Students",
    title: "Local advisors. Global campuses.",
    text: "Dhaka, Cumilla and Sylhet teams help you choose the right course, university and visa path.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&h=700&q=80",
  },
  pakistan: {
    label: "Pakistan Students",
    title: "Plan your study abroad from Lahore & Karachi",
    text: "Personal counselling, application support and visa guidance for Pakistani students.",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1400&h=700&q=80",
  },
  nigeria: {
    label: "Nigeria Students",
    title: "From Lagos and Abuja to world-class universities",
    text: "Clear pathways to the UK and beyond — with advisors who know your goals.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&h=700&q=80",
  },
};

export default function Contact() {
  const { branches, getPage } = useSite();
  const page = getPage("contact-us");
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get("country") || "uk";
  const [active, setActive] = useState(
    CONTACT_REGIONS.some((r) => r.key === initial) ? initial : "uk"
  );

  useEffect(() => {
    const q = searchParams.get("country") || "uk";
    if (CONTACT_REGIONS.some((r) => r.key === q)) setActive(q);
  }, [searchParams]);

  const region = CONTACT_REGIONS.find((r) => r.key === active) || CONTACT_REGIONS[0];
  const regionBranches = useMemo(
    () => branches.filter((b) => region.match(b)),
    [branches, region]
  );
  const banner = REGION_BANNER[region.key] || REGION_BANNER.uk;

  const selectRegion = (key) => {
    setActive(key);
    setSearchParams(key === "uk" ? {} : { country: key }, { replace: true });
  };

  return (
    <>
      <SeoHead
        seo={page}
        title="Contact Us | Education Doorway"
        description="Reach Education Doorway by phone, WhatsApp, email, or visit one of our global branches."
        path="/contact-us"
      />
      <PageHero
        eyebrow="Contact Us"
        title="Find Us & Reach Out"
        subtitle="Trusted path to study abroad — our advisors are ready to answer your questions."
        crumbs={[{ label: "Contact Us" }]}
      />

      {/* Four country boxes at top */}
      <section className="container-x relative z-10 -mt-6 sm:-mt-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {CONTACT_REGIONS.map((r, i) => {
            const selected = active === r.key;
            const count = branches.filter((b) => r.match(b)).length;
            return (
              <Reveal key={r.key} delay={i * 70}>
                <button
                  type="button"
                  onClick={() => selectRegion(r.key)}
                  aria-pressed={selected}
                  className={`flex h-full w-full flex-col rounded-2xl border bg-white p-3.5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10 sm:p-6 ${
                    selected
                      ? "border-brand-400 ring-2 ring-brand-200"
                      : "border-slate-100 hover:border-brand-200"
                  }`}
                >
                  <span className="inline-flex">
                    <Flag code={r.code} className="h-10 w-10 sm:h-12 sm:w-12" title={r.label} />
                  </span>
                  <h3 className="mt-3 font-display text-sm font-bold text-ink sm:mt-4 sm:text-lg">
                    <span className="sm:hidden">{r.short}</span>
                    <span className="hidden sm:inline">{r.label}</span>
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 sm:mt-1.5 sm:text-sm">
                    {count} {count === 1 ? "branch" : "branches"}
                    {r.key === "uk" ? " · HQ" : ""}
                  </p>
                  {selected && (
                    <span className="mt-2 inline-flex w-fit rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700 sm:mt-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
                      Selected
                    </span>
                  )}
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Selected country branches */}
      <section className="container-x pb-6 pt-10 sm:pt-14">
        <SectionHeading
          eyebrow="Our Global Branches"
          title="Visit Us Around the World"
          subtitle="Choose a country above to see every branch — United Kingdom opens by default."
        />

        <div className="mt-8 sm:mt-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-center gap-3">
              <Flag code={region.code} className="h-12 w-12 sm:h-14 sm:w-14" title={region.label} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Selected country</p>
                <h3 className="font-display text-xl font-extrabold text-ink sm:text-2xl">{region.label} branches</h3>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              {regionBranches.length} {regionBranches.length === 1 ? "location" : "locations"}
            </p>
          </div>

          {regionBranches.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-6 py-12 text-center text-slate-500">
              Branches for {region.label} will appear here soon.
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {regionBranches.map((b, i) => (
                <Reveal key={b.slug} delay={(i % 2) * 70}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10">
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-200">
                      <img
                        src={b.image}
                        alt={`${b.city} office — Education Doorway`}
                        className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/55 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <Flag code={b.code} className="h-8 w-8 ring-2 ring-white/80" title={b.country} />
                        {b.head && (
                          <span className="rounded-full bg-gold-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                            Head Office
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-display text-xl font-bold text-ink">{b.city} Branch</h4>
                          <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-400">{b.country}</p>
                        </div>
                        {b.head && (
                          <span className="shrink-0 rounded-full bg-gold-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gold-600">
                            Head Office
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600">{b.blurb}</p>

                      <div className="mt-4 space-y-2 text-sm text-slate-500">
                        <p className="flex items-start gap-2">
                          <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                          {b.address}
                        </p>
                        <p className="flex items-center gap-2">
                          <Icon name="phone" className="h-4 w-4 shrink-0 text-brand-400" />
                          {b.phone}
                        </p>
                        <p className="flex items-center gap-2 text-brand-600">
                          <Icon name="whatsapp" className="h-4 w-4 shrink-0" />
                          +44 7939 983 493 (WhatsApp)
                        </p>
                        <p className="flex items-center gap-2">
                          <Icon name="clock" className="h-4 w-4 shrink-0 text-brand-400" />
                          {b.hours}
                        </p>
                      </div>

                      <Link
                        to={`/branch/${b.slug}`}
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition group-hover:gap-2"
                      >
                        View full branch page <Icon name="arrow" className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Region students banner */}
      <section className="container-x py-8 sm:py-10">
        <Reveal className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm sm:rounded-3xl">
          <div className="relative min-h-[240px] sm:min-h-[360px]">
            <img
              src={banner.image}
              alt={banner.label}
              className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/45 to-brand-950/15 sm:bg-gradient-to-r sm:from-brand-950/80 sm:via-brand-950/40 sm:to-transparent" />
            <div className="relative flex min-h-[240px] max-w-xl flex-col justify-end p-5 text-white sm:min-h-[360px] sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">{banner.label}</p>
              <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight sm:text-4xl">{banner.title}</h3>
              <p className="mt-3 text-sm text-brand-100 sm:text-base">{banner.text}</p>
            </div>
          </div>
        </Reveal>
      </section>

      <CounsellingSection />
    </>
  );
}
