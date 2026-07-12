import { Link } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import Counter from "../components/Counter";
import EventCard from "../components/EventCard";
import Flag from "../components/Flag";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import {
  articles,
  cityImage,
  countries,
  events,
  gradientFor, monogram,
  partners,
  popularSubjects,
  processSteps,
  services,
  stats,
  testimonials, universityBySlug,
  whyUs
} from "../data/site";

const trustItems = [
  "Free Counselling", "200+ Universities", "11+ Destinations", "98% Visa Success",
  "1,500+ Students", "Certified Consultants", "Scholarship Guidance",
];

export default function Home() {
  return (
    <>
      <Hero />
      <TrustMarquee />
      <Stats />
      <WhyUs />
      <Destinations />
      <Programmes />
      <Services />
      <Process />
      <Partners />
      <Testimonials />
      <Articles />
      <Events />
      <FinalCta />
    </>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-950">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_15%_20%,rgba(89,141,255,.65),transparent_40%),radial-gradient(circle_at_85%_15%,rgba(240,180,41,.35),transparent_38%),radial-gradient(circle_at_60%_90%,rgba(30,70,230,.6),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div className="rise-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-400">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" /> Trusted since 2015
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your Trusted Path to{" "}
            <span className="relative whitespace-nowrap">
              <span className="bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">Study Abroad</span>
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
            End-to-end support from choosing the right course to landing your visa. Join 1,500+
            students who trusted Abroad Study to build their international academic career.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/apply-now" className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-400 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:brightness-110">
              Apply Now <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/contact-us" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/10">
              Free Counselling
            </Link>
          </div>
          <div className="mt-9 flex items-center gap-5">
            <div className="flex -space-x-3">
              {testimonials.slice(0, 5).map((t) => (
                <span key={t.initials} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-950 bg-gradient-to-br from-brand-400 to-brand-700 text-xs font-bold text-white">
                  {t.initials}
                </span>
              ))}
            </div>
            <div className="text-sm text-slate-300">
              <div className="flex text-gold-400">{"★★★★★"}</div>
              <span>Loved by <strong className="text-white">1,500+</strong> students</span>
            </div>
          </div>
        </div>

        {/* Floating visual */}
        <div className="relative hidden lg:block">
          <Reveal delay={150} className="relative mx-auto max-w-md">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 p-6 text-white">
                <p className="text-sm text-white/80">Where do you want to study?</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {countries.slice(0, 4).map((c) => (
                    <Link key={c.slug} to={`/study/${c.slug}`} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-medium transition hover:bg-white/20">
                      <Flag code={c.code} className="text-lg" title={c.name} /> {c.name.split(" ")[0]}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-white">
                <MiniStat value="98%" label="Visa Success" />
                <MiniStat value="200+" label="Universities" />
                <MiniStat value="24/7" label="Support" />
              </div>
            </div>
            <div className="absolute -right-5 -top-5 flex items-center gap-2 rounded-2xl bg-white p-3 shadow-xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"><Icon name="check" className="h-5 w-5" /></span>
              <div className="pr-1 text-left">
                <p className="text-xs font-bold text-ink">Admission Confirmed</p>
                <p className="text-[11px] text-slate-500">University of Manchester</p>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 flex items-center gap-2 rounded-2xl bg-white p-3 shadow-xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500/20 text-gold-600"><Icon name="award" className="h-5 w-5" /></span>
              <div className="pr-1 text-left">
                <p className="text-xs font-bold text-ink">Scholarship Won</p>
                <p className="text-[11px] text-slate-500">50% Tuition Waiver</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ value, label }) {
  return (
    <div className="rounded-xl bg-white/10 py-3">
      <p className="font-display text-lg font-extrabold">{value}</p>
      <p className="text-[11px] text-white/70">{label}</p>
    </div>
  );
}

/* ---------------- Trust marquee ---------------- */
function TrustMarquee() {
  const items = [...trustItems, ...trustItems];
  return (
    <div className="border-y border-slate-200 bg-white py-4">
      <div className="relative overflow-hidden">
        <div className="flex w-max animate-marquee gap-10 pr-10">
          {items.map((t, i) => (
            <span key={i} className="flex items-center gap-2.5 whitespace-nowrap text-sm font-semibold text-slate-600">
              <Icon name="check" className="h-4 w-4 text-brand-500" /> {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Stats ---------------- */
function Stats() {
  return (
    <section className="container-x mt-12 sm:mt-14 relative z-10">
      <div className="grid grid-cols-2 gap-3 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-brand-950/5 sm:gap-6 md:grid-cols-4 md:p-8">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 90} className="text-center">
            <Counter to={s.value} suffix={s.suffix} className="font-display text-3xl font-extrabold text-brand-600 sm:text-4xl" />
            <p className="mt-1 text-sm font-medium text-slate-500">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Why us ---------------- */
function WhyUs() {
  return (
    <section className="container-x py-16 sm:py-20 lg:py-24">
      <SectionHeading eyebrow="Why Abroad Study" title="Why 1,500+ Students Trust Us"
        subtitle="Complete end-to-end support from choosing the right course to landing your visa." />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {whyUs.map((w, i) => (
          <Reveal key={w.title} delay={i * 70}>
            <div className="group h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <Icon name={w.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{w.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{w.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {[
          { t: "Our Vision", d: "To be Bangladesh's most trusted gateway for international education.", i: "target" },
          { t: "Our Mission", d: "To provide honest, expert and personalized guidance to every student.", i: "compass" },
          { t: "Our Values", d: "Integrity, transparency and a student-first commitment guide us.", i: "spark" },
        ].map((c, i) => (
          <Reveal key={c.t} delay={i * 80}>
            <div className="flex h-full items-start gap-4 rounded-2xl bg-gradient-to-br from-brand-950 to-brand-800 p-6 text-white">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-400">
                <Icon name={c.i} className="h-6 w-6" />
              </span>
              <div>
                <h4 className="font-display text-lg font-bold">{c.t}</h4>
                <p className="mt-1 text-sm text-slate-300">{c.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Destinations ---------------- */
function Destinations() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading center={false} eyebrow="Study Destinations"
            title={<>Choose Your <span className="text-brand-500">Dream Destination</span></>}
            subtitle="Explore top study destinations trusted by thousands of Bangladeshi students every year." />
          <Reveal>
            <Link to="/countries" className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-50">
              View All Countries <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          {countries.slice(0, 8).map((c, i) => {
            const count = countUni(c.slug);
            return (
              <Reveal key={c.slug} delay={i * 60}>
                <Link
                  to={`/study/${c.slug}`}
                  className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-900/20"
                >
                  {/* Fallback gradient sits behind the photo */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientFor(c.slug)}`} />
                  <img
                    src={cityImage[c.slug]}
                    alt={`${c.name} skyline`}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5" />

                  <div className="relative p-5">
                    <span className="mb-3 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full shadow-lg ring-2 ring-white/80 transition-transform group-hover:scale-110">
                      <Flag code={c.code} fill title={c.name} />
                    </span>
                    <p className="font-display text-base font-bold leading-tight text-white drop-shadow">{c.name}</p>
                    <p className="mt-0.5 text-xs font-medium text-white/85">
                      {count} {count === 1 ? "University" : "Universities"}
                    </p>
                  </div>

                  <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
                    <Icon name="arrow" className="h-4.5 w-4.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function countUni(slug) {
  return Object.values(universityBySlug).filter((u) => u.country === slug).length;
}

/* ---------------- Programmes ---------------- */
function Programmes() {
  const cards = [
    { key: "undergraduate", name: "Undergraduate", d: "Bachelor's degree programmes across top-ranked universities worldwide with scholarship options.", i: "cap" },
    { key: "postgraduate", name: "Postgraduate / Masters", d: "MSc, MBA and MA programmes to accelerate your career with strong academic outcomes.", i: "book" },
    { key: "foundation", name: "Foundation & Diploma", d: "Build the academic base you need to progress into degree programmes with confidence.", i: "spark" },
  ];
  return (
    <section className="container-x py-16 sm:py-20 lg:py-24">
      <SectionHeading eyebrow="Academic Programmes" title="Find Your Perfect Course" />
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {cards.map((c, i) => (
          <Reveal key={c.key} delay={i * 90}>
            <Link to={`/study/all/${c.key}/all`} className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10">
              <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-3 text-white">
                <Icon name={c.i} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-ink">{c.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{c.d}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                Explore <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-6 rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
        <h3 className="font-display text-lg font-bold text-ink">Popular Subject Areas</h3>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {popularSubjects.map((s) => (
            <Link key={s} to="/courses" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700">
              {s}
            </Link>
          ))}
          <Link to="/courses" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
            All Subjects →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- Services ---------------- */
function Services() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading eyebrow="What We Offer" title="Our Comprehensive Services" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 70}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-6 transition hover:shadow-xl hover:shadow-brand-500/10">
                <span className="absolute -right-6 -top-6 font-display text-7xl font-black text-slate-100 transition group-hover:text-brand-100">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <h3 className="relative mt-4 font-display text-lg font-bold text-ink">{s.title}</h3>
                <p className="relative mt-1.5 text-sm leading-relaxed text-slate-500">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Process ---------------- */
function Process() {
  return (
    <section className="container-x py-16 sm:py-20 lg:py-24">
      <SectionHeading eyebrow="Simple Process" title="How It Works"
        subtitle="Our streamlined process takes you from consultation to campus." />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {processSteps.map((s, i) => (
          <Reveal key={s.title} delay={i * 90} className="relative">
            <div className="flex h-full flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-800 font-display text-xl font-extrabold text-white shadow-lg shadow-brand-500/30">
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink">{s.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{s.text}</p>
            </div>
            {i < processSteps.length - 1 && (
              <Icon name="arrow" className="absolute -right-4 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-brand-300 lg:block" />
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Partners ---------------- */
function Partners() {
  const list = partners.map((s) => universityBySlug[s]).filter(Boolean);
  const row = [...list, ...list];
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading eyebrow="Our Partners" title="Affiliated Universities"
          subtitle="Explore active university partners and jump straight to each detail page." />
      </div>
      <div className="relative mt-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />
        <div className="flex w-max animate-marquee gap-4 pr-4">
          {row.map((u, i) => (
            <Link key={i} to={`/university/${u.slug}`} className="flex w-56 shrink-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-brand-200 hover:shadow-lg">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradientFor(u.slug)} font-display text-sm font-extrabold text-white`}>
                {monogram(u.name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-ink">{u.name}</span>
                <span className="block text-xs capitalize text-slate-400">{u.country}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
function Testimonials() {
  return (
    <section className="container-x py-16 sm:py-20 lg:py-24">
      <SectionHeading eyebrow="Student Stories" title="What Our Students Say" />
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={(i % 3) * 90}>
            <figure className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-xl hover:shadow-brand-500/10">
              <div className="flex text-gold-500">
                {Array.from({ length: 5 }).map((_, k) => <Icon key={k} name="star" className="h-4 w-4 fill-current" stroke={0} />)}
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">"{t.text}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-800 text-sm font-bold text-white">{t.initials}</span>
                <div>
                  <p className="text-sm font-bold text-ink">{t.name}</p>
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Flag code={t.code} className="text-xs" title={t.place} /> {t.place}
                  </p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Articles ---------------- */
function Articles() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading center={false} eyebrow="Insights & Guides"
            title={<>Latest <span className="text-brand-500">Articles</span></>}
            subtitle="Expert tips on applications, visas, scholarships and life abroad to guide your journey." />
          <Reveal>
            <Link to="/articles" className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-50">
              View All Articles <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((a, i) => (
            <Reveal key={a.slug} delay={i * 80}>
              <ArticleCard article={a} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Events ---------------- */
function Events() {
  return (
    <section className="container-x py-16 sm:py-20 lg:py-24">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading center={false} eyebrow="What's On"
          title={<>Upcoming <span className="text-brand-500">Events</span></>}
          subtitle="Join our fairs, webinars and workshops to meet universities and get expert guidance." />
        <Reveal>
          <Link to="/events" className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-50">
            View All Events <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.slice(0, 3).map((e, i) => (
          <Reveal key={e.slug} delay={i * 80}>
            <EventCard event={e} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */
function FinalCta() {
  return (
    <section className="container-x">
      <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-6 py-14 text-center shadow-2xl shadow-brand-900/20 sm:px-12">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_1.5px,transparent_1.5px)] [background-size:26px_26px]" />
        <h2 className="relative font-display text-3xl font-extrabold text-white sm:text-4xl">
          Ready to Start Your <span className="text-gold-400">Study Abroad Journey?</span>
        </h2>
        <p className="relative mx-auto mt-4 max-w-2xl text-brand-100">
          Join 1,500+ students who trusted Abroad Study Consultancy to build their international academic career.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/apply-now" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-brand-700 shadow-lg transition hover:bg-gold-400 hover:text-brand-950">
            Book Free Counselling <Icon name="arrow" className="h-5 w-5" />
          </Link>
          <Link to="/study" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10">
            Browse Universities
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
