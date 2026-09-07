import { Link } from "react-router-dom";
import CounsellingSection from "../components/CounsellingSection";
import Flag from "../components/Flag";
import Icon from "../components/Icon";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SeoHead from "../components/SeoHead";
import UniversityCard from "../components/UniversityCard";
import { useSite } from "../api/SiteContext";
import { cityImage } from "../data/site";

const highlights = [
  {
    icon: "cap",
    title: "World-ranked universities",
    text: "Home to Oxford, Cambridge and dozens of globally ranked institutions with strong research and teaching reputations.",
  },
  {
    icon: "clock",
    title: "1-year master's degrees",
    text: "Complete a master's in as little as 12 months — saving time and living costs compared with many other destinations.",
  },
  {
    icon: "award",
    title: "Graduate Route visa",
    text: "Stay and work in the UK for 2 years after graduation (3 years for PhD) without needing a sponsor.",
  },
  {
    icon: "globe",
    title: "Diverse & welcoming",
    text: "A multicultural society with clear student support, English-taught programmes and vibrant campus life.",
  },
];

const whyUk = [
  {
    title: "Shorter, focused degrees",
    text: "Undergraduate degrees typically last 3 years and master's just 1 year, helping you enter the workforce sooner.",
  },
  {
    title: "Strong career outcomes",
    text: "UK degrees are recognised worldwide. Many programmes include placements, industry projects and career support.",
  },
  {
    title: "Scholarships & support",
    text: "From Chevening and Commonwealth awards to university-specific scholarships — we help you find funding that fits.",
  },
  {
    title: "Clear visa pathway",
    text: "Student visas are well-structured, and the Graduate Route gives you time to gain UK work experience after study.",
  },
];

const popularAreas = [
  "Business & Management",
  "Computing & Technology",
  "Nursing & Health Sciences",
  "Engineering",
  "Law",
  "Data Science",
  "Finance & Accounting",
  "Creative Arts",
];

export default function StudyUK() {
  const { universities, getPage } = useSite();
  const seoPage = getPage("study-in-uk");
  const ukUnis = universities.filter((u) => u.country === "uk");
  const heroImage = cityImage.uk;

  return (
    <>
      <SeoHead
        seo={seoPage}
        title="Study in UK | Education Doorway"
        description="Explore studying in the United Kingdom — top universities, 1-year master's, Graduate Route visa, and expert counselling for Bangladeshi students."
        path="/study-in-uk"
      />
      <PageHero
        eyebrow="United Kingdom"
        title="Study in the UK"
        subtitle="Prestigious universities, shorter degrees and a clear post-study work route — guided by Education Doorway from counselling to visa."
        crumbs={[{ label: "Study in UK" }]}
      />

      {/* UK visual + intro */}
      <section className="container-x -mt-8 relative z-10">
        <Reveal className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-brand-950/5">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[260px] bg-slate-200 lg:min-h-full">
              <img
                src={heroImage}
                alt="London skyline — study in the United Kingdom"
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/uk-students.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-brand-950/10" />
              <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-sm font-semibold text-brand-800 shadow-sm backdrop-blur">
                <Flag code="gb" className="text-lg" title="United Kingdom" />
                United Kingdom
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
                Your doorway to British education
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                The UK remains one of the most popular destinations for Bangladeshi students — thanks to
                world-class teaching, intensive master's programmes and the Graduate Route visa. Education
                Doorway helps you shortlist universities, prepare applications and navigate visas with
                confidence.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/apply-now"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:brightness-110"
                >
                  Book free counselling <Icon name="arrow" className="h-4 w-4" />
                </Link>
                <Link
                  to="/study/uk"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-700"
                >
                  Browse UK universities
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Highlights */}
      <section className="container-x py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold text-ink">Why students choose the UK</h2>
          <p className="mt-3 text-slate-500">
            Four reasons the United Kingdom stands out for international study.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h, i) => (
            <Reveal key={h.title} delay={(i % 4) * 70}>
              <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name={h.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">{h.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{h.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Deeper why + popular subjects */}
      <section className="bg-slate-50 py-16">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">What to expect</h2>
            <p className="mt-3 text-slate-500">
              Studying in the UK is intensive, career-focused and designed to get you ready for global opportunities.
            </p>
            <ul className="mt-8 space-y-5">
              {whyUk.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
              <h2 className="font-display text-2xl font-extrabold text-ink">Popular study areas</h2>
              <p className="mt-2 text-sm text-slate-500">
                Subjects Bangladeshi students often pursue in the UK.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {popularAreas.map((area) => (
                  <Link
                    key={area}
                    to="/courses"
                    className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {area}
                  </Link>
                ))}
              </div>
              <Link
                to="/courses"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"
              >
                Open Course Finder <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Partner universities */}
      {ukUnis.length > 0 && (
        <section className="container-x py-16">
          <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-ink">Partner universities in the UK</h2>
              <p className="mt-2 text-slate-500">
                Explore institutions we work with for UK admissions.
              </p>
            </div>
            <Link
              to="/study/uk"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"
            >
              View all UK universities <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ukUnis.slice(0, 6).map((u, i) => (
              <Reveal key={u.slug} delay={(i % 3) * 70}>
                <UniversityCard uni={u} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <CounsellingSection />
    </>
  );
}
