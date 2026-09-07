import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../api/SiteContext";
import ArticleCard from "../components/ArticleCard";
import Counter from "../components/Counter";
import EventCard from "../components/EventCard";
import Flag from "../components/Flag";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import SeoHead from "../components/SeoHead";
import StoryCard from "../components/StoryCard";

gsap.registerPlugin(ScrollTrigger);

const trustItems = [
  "Free Counselling", "200+ Universities", "11+ Destinations", "98% Visa Success",
  "75,000+ Students", "Certified Consultants", "Scholarship Guidance",
];

export default function Home() {
  const site = useSite();
  const page = site.getPage("home");
  return (
    <>
      <SeoHead
        seo={page}
        title="Education Doorway | Trusted Path to Study Abroad"
        description="Free counselling, 200+ universities, and end-to-end study abroad support."
        path="/"
      />
      <Hero />
      <TrustMarquee />
      <Stats />
      <Services />
      <VideoStories />
      <WhyUs />
      <Partners />
      <Testimonials />
      <Programmes />
      <Events />
      <Articles />
      <FinalCta />
    </>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  const { countries } = useSite();
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const title = "[data-hero-title]";
      const text = "[data-hero-text]";
      const ctas = "[data-hero-cta] > *";
      const card = "[data-hero-card]";
      const floatBadge = "[data-hero-badge-float]";
      const cardFloat = "[data-hero-card-float]";

      gsap.set([title, text, ctas, card, floatBadge], { autoAlpha: 0 });
      gsap.set([title, text], { y: 28 });
      gsap.set(ctas, { y: 18 });
      gsap.set(card, { x: 40 });
      gsap.set(floatBadge, { y: 20, scale: 0.94 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.to(title, { autoAlpha: 1, y: 0, duration: 0.85 })
        .to(text, { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.5")
        .to(ctas, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.12 }, "-=0.4")
        .to(card, { autoAlpha: 1, x: 0, duration: 0.9 }, "-=0.55")
        .to(floatBadge, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6 }, "-=0.45");

      // Soft float after entrance — separate wrappers so they don't fight
      tl.add(() => {
        gsap.to(cardFloat, {
          y: -10,
          duration: 2.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap.to(floatBadge, {
          y: -6,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden bg-brand-950">
      {/* World-map overlay — full-wide, centered */}
      <img
        src="/overlay-map.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[135%] w-[170%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-center opacity-[0.3] sm:opacity-[0.34]"
      />
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_15%_20%,rgba(0,178,255,.55),transparent_42%),radial-gradient(circle_at_85%_15%,rgba(79,210,255,.28),transparent_38%),radial-gradient(circle_at_60%_90%,rgba(17,112,214,.55),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-950/50 via-transparent to-brand-950/30" />
      <div className="container-x relative z-10 grid items-center gap-8 py-12 sm:gap-12 sm:py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <h1 data-hero-title className="font-display text-[1.85rem] font-extrabold leading-[1.1] tracking-tight text-white opacity-0 sm:text-5xl lg:text-6xl">
            Your Trusted Path to{" "}
            <span className="relative whitespace-nowrap">
              <span className="bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">Study Abroad</span>
            </span>
          </h1>
          <p data-hero-text className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300 opacity-0 sm:mt-5 sm:text-lg">
            End-to-end support from choosing the right course to landing your visa. Join 75,000+
            students who trusted Education Doorway to build their international academic career.
          </p>
          <div data-hero-cta className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Link to="/apply-now" className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-400 px-6 py-3.5 font-semibold text-white opacity-0 shadow-lg shadow-brand-500/30 transition hover:brightness-110 sm:w-auto">
              Apply Now <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/contact-us" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 font-semibold text-white opacity-0 backdrop-blur transition hover:bg-white/10 sm:w-auto">
              Free Counselling
            </Link>
          </div>
        </div>

        {/* Floating visual */}
        <div className="relative mt-2 pb-20 lg:mt-0 lg:pb-16">
          <div data-hero-card-float className="relative mx-auto max-w-md will-change-transform">
            <div data-hero-card className="rounded-3xl border border-white/10 bg-white/5 p-4 opacity-0 backdrop-blur-xl sm:p-6">
              <div className="grid grid-cols-3 gap-3 text-center text-white">
                <MiniStat value="98%" label="Visa Success" />
                <MiniStat value="200+" label="Universities" />
                <MiniStat value="24/7" label="Support" />
              </div>
              <div className="mt-4 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 p-5 text-white sm:p-6">
                <p className="text-sm text-white/80">Where do you want to study?</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {countries.slice(0, 2).map((c) => (
                    <Link key={c.slug} to={`/study/${c.slug}`} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-medium transition hover:bg-white/20">
                      <Flag code={c.code} className="text-lg" title={c.name} /> {c.name.split(" ")[0]}
                    </Link>
                  ))}
                </div>
                <Link to="/countries" className="mt-2 sm:mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-white/15 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/25">
                  View others countries <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="absolute left-1/2 top-full z-10 mt-3 w-[92%] max-w-sm -translate-x-1/2 sm:w-[88%]">
              <div data-hero-badge-float className="flex w-full items-center gap-2 rounded-2xl bg-white p-3 opacity-0 shadow-xl will-change-transform sm:p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-500/20 text-gold-600"><Icon name="award" className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-xs font-bold text-ink sm:text-sm">January 2027 Intake- Application Now Open</p>
                  <p className="text-[11px] text-slate-500">Secure Your Place & Start Your Journey to Success</p>
                </div>
              </div>
            </div>
          </div>
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
  const { stats } = useSite();
  return (
    <section className="container-x relative  z-10 -mt-2 sm:mt-4">
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-100 bg-brand-600 p-4 shadow-xl shadow-brand-950/5 sm:gap-6 sm:rounded-3xl sm:p-6 md:grid-cols-4 md:p-8">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 90} className="text-center">
            <Counter to={s.value} suffix={s.suffix} className="font-display text-2xl font-extrabold text-white sm:text-4xl" />
            <p className="mt-1 text-xs font-medium text-white sm:text-sm">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Why us ---------------- */
function WhyUs() {
  const { whyUs, pillars } = useSite();
  return (
    <section className="bg-white py-6 sm:py-6">
      <div className="container-x">
      {/* <SectionHeading eyebrow="Why Education Doorway" title="Why 75,000+ Students Trust Us"
        subtitle="Complete end-to-end support from choosing the right course to landing your visa." /> */}
      {/* <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
      </div> */}

      <div className="grid gap-5 md:grid-cols-3">
        {pillars.map((c, i) => (
          <Reveal key={c.slug} delay={i * 80}>
            <Link
              to={`/${c.slug}`}
              className="group flex h-full items-start gap-4 rounded-2xl bg-gradient-to-br from-brand-950 to-brand-800 p-6 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-950/30"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-400">
                <Icon name={c.icon} className="h-6 w-6" />
              </span>
              <div>
                <h4 className="font-display text-lg font-bold">{c.title}</h4>
                <p className="mt-1 line-clamp-2 text-sm text-slate-300">{c.teaser}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}

/* ---------------- Programmes ---------------- */
function Programmes() {
  const { subjects } = useSite();
  const cards = [
    { key: "foundation", name: "Foundation & Diploma", d: "Build the academic base you need to progress into degree programmes with confidence.", i: "spark" },
    { key: "undergraduate", name: "Undergraduate", d: "Bachelor's degree programmes across top-ranked universities worldwide with scholarship options.", i: "cap" },
    { key: "postgraduate", name: "Postgraduate / Masters", d: "MSc, MBA and MA programmes to accelerate your career with strong academic outcomes.", i: "book" },
  ];
  const subjectSlug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const row = [...subjects, ...subjects];
  return (
    <section className="bg-gradient-to-b from-brand-50 via-brand-50/60 to-white py-8 sm:py-10 lg:py-12">
      <div className="container-x">
      <SectionHeading eyebrow="Academic Programmes" title="Find Your Perfect Course" />
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
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
      </div>

      <div className="group/subjects relative mt-8 overflow-hidden bg-brand-600 py-4 sm:py-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-brand-600 to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-brand-600 to-transparent sm:w-20" />
        <div className="flex w-max animate-marquee-slow gap-3 pr-3 group-hover/subjects:[animation-play-state:paused]">
          {row.map((s, i) => (
            <Link
              key={`${s}-${i}`}
              to={`/study/all/all/${subjectSlug(s)}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/25 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-gold-400 hover:text-brand-950"
            >
              <Icon name="book" className="h-4 w-4 shrink-0 text-brand-500" />
              {s}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Services ---------------- */
function Services() {
  const { services } = useSite();
  return (
    <section className="bg-white py-8 sm:py-10">
      <div className="container-x">
        <SectionHeading eyebrow="What We Offer" title="Our Comprehensive Services" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 70}>
              <div className="group flex h-full flex-col items-center rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white px-3 py-5 text-center transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/10 sm:px-4 sm:py-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm sm:h-14 sm:w-14">
                  <Icon name={s.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
                </span>
                <h3 className="mt-3 font-display text-sm font-bold leading-snug text-ink sm:text-[15px]">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Video stories ---------------- */
function VideoStories() {
  const { stories, storyCategories } = useSite();
  const featured = storyCategories
    .map((c) => stories.find((s) => s.roleKey === c.key))
    .filter(Boolean)
    .slice(0, 3);
  const fallback = stories.slice(0, 3);
  const cards = featured.length ? featured : fallback;

  return (
    <section className="bg-gradient-to-b from-white via-brand-50/70 to-white py-4 sm:py-6 lg:py-0">
      <div className="container-x">
        <SectionHeading
          eyebrow="Video Testimonials"
          title="Hear It From Our Community"
          subtitle="Watch real stories from guardians, students and university delegates — title and description come from each story in the CMS."
        />

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {storyCategories.map((c) => (
            <Link
              key={c.key}
              to={`/stories/${c.key}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
            >
              {c.short || c.label}
            </Link>
          ))}
          <Link
            to="/stories"
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/25"
          >
            All stories
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((story, i) => (
            <Reveal key={story.slug} delay={i * 90}>
              <StoryCard story={story} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Partners ---------------- */
function Partners() {
  const { partners, universityBySlug, countryBySlug, monogram } = useSite();
  const list = partners.map((s) => universityBySlug[s]).filter(Boolean);
  const row = [...list, ...list];
  return (
    <section className="bg-white py-8 sm:py-10 lg:py-12">
      <div className="container-x">
        <SectionHeading eyebrow="Our Partners" title="Affiliated Universities"
          subtitle="Explore active university partners and jump straight to each detail page." />
      </div>
      <div className="relative mt-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />
        <div className="mb-2 flex w-max animate-marquee gap-4 pr-4">
          {row.map((u, i) => {
            const country = countryBySlug[u.country] || countryBySlug[u.countrySlug];
            const hasLogo = Boolean(u.logoUrl) && !/ui-avatars\.com/i.test(u.logoUrl);
            return (
              <Link
                key={i}
                to={`/university/${u.slug}`}
                className="flex w-64 shrink-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm transition hover:border-brand-200 hover:shadow-lg"
              >
                <span className="flex h-14 w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                  {hasLogo ? (
                    <img
                      src={u.logoUrl}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain p-1.5"
                    />
                  ) : (
                    <span className="font-display text-sm font-extrabold text-brand-700">
                      {monogram(u.name)}
                    </span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-ink">{u.name}</span>
                  <span className="block text-xs text-slate-400">{country?.name || u.country}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
function Testimonials() {
  const { testimonials } = useSite();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const pausedRef = useRef(false);

  const scrollByCards = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const amount = card ? card.offsetWidth + 20 : el.clientWidth * 0.9;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (dir > 0 && el.scrollLeft >= maxScroll - 4) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (dir < 0 && el.scrollLeft <= 4) {
      el.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      el.scrollBy({ left: dir * amount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) scrollByCards(1);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heading = "[data-testimonial-heading]";
      const cards = "[data-card]";
      const nav = "[data-testimonial-nav]";

      gsap.set([heading, cards, nav], { autoAlpha: 0 });
      gsap.set(heading, { y: 36 });
      gsap.set(cards, { y: 40 });
      gsap.set(nav, { scale: 0.75 });

      gsap.to(heading, {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: trackRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      gsap.to(nav, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.55,
        stagger: 0.1,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: trackRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-brand-950 py-8 sm:py-10 lg:py-12">
      <img
        src="/overlay-map.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[135%] w-[170%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-center opacity-[0.22]"
      />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_15%_20%,rgba(0,178,255,.4),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(17,112,214,.5),transparent_45%)]" />
      <div className="container-x relative z-10">
      <div data-testimonial-heading>
        <SectionHeading reveal={false} light eyebrow="Student Stories" title="What Our Students Say"
          subtitle="Real stories from students who trusted us with their study-abroad journey." />
      </div>

      <div
        className="relative mt-6"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
        >
          {testimonials.map((t) => (
            <figure
              key={t.name}
              data-card
              className="flex w-[86%] shrink-0 snap-start flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
            >
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
          ))}
        </div>

        <button
          type="button"
          data-testimonial-nav
          aria-label="Previous testimonials"
          onClick={() => scrollByCards(-1)}
          className="absolute -left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-700 shadow-lg ring-1 ring-black/5 transition hover:bg-brand-50 lg:-left-5"
        >
          <Icon name="arrow" className="h-5 w-5 rotate-180" />
        </button>
        <button
          type="button"
          data-testimonial-nav
          aria-label="Next testimonials"
          onClick={() => scrollByCards(1)}
          className="absolute -right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-700 shadow-lg ring-1 ring-black/5 transition hover:bg-brand-50 lg:-right-5"
        >
          <Icon name="arrow" className="h-5 w-5" />
        </button>
      </div>
      </div>
    </section>
  );
}

/* ---------------- Articles ---------------- */
function Articles() {
  const { articles } = useSite();
  return (
    <section className="bg-white pt-2 pb-8 sm:pt-3 sm:pb-10 lg:pt-4 lg:pb-12">
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
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
  const { events } = useSite();
  return (
    <section className="bg-gradient-to-b from-brand-50 to-white pt-8 pb-4 sm:pt-10 sm:pb-5 lg:pt-12 lg:pb-6">
      <div className="container-x">
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
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.slice(0, 3).map((e, i) => (
          <Reveal key={e.slug} delay={i * 80}>
            <EventCard event={e} />
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */
function FinalCta() {
  return (
    <section className="container-x py-8 sm:py-10">
      <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-6 py-14 text-center shadow-2xl shadow-brand-900/20 sm:px-12">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_1.5px,transparent_1.5px)] [background-size:26px_26px]" />
        <h2 className="relative font-display text-3xl font-extrabold text-white sm:text-4xl">
          Ready to Start Your <span className="text-gold-400">Study Abroad Journey?</span>
        </h2>
        <p className="relative mx-auto mt-4 max-w-2xl text-brand-100">
          Join 1,500+ students who trusted Education Doorway to build their international academic career.
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
