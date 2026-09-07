import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CounsellingSection from "../components/CounsellingSection";
import Flag from "../components/Flag";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import { useSite } from "../api/SiteContext";
import { buildUniversityDetails } from "../data/universityDetails";
import NotFound from "./NotFound";

const TABS = [
  { id: "overview", label: "Overview", icon: "compass" },
  { id: "programmes", label: "Programmes", icon: "cap" },
  { id: "student-life", label: "Student Life", icon: "users" },
  { id: "accommodation", label: "Accommodation", icon: "home" },
  { id: "campus", label: "Campus", icon: "pin" },
];

export default function University() {
  const { slug } = useParams();
  const {
    universityBySlug,
    countryBySlug,
    universities,
    programs,
    gradientFor,
    monogram,
  } = useSite();
  const uni = universityBySlug[slug];
  const [tab, setTab] = useState("overview");
  const [showDetails, setShowDetails] = useState(false);

  const programName = useMemo(
    () => Object.fromEntries(programs.map((p) => [p.key, p.name])),
    [programs]
  );

  const country = uni ? countryBySlug[uni.country] : null;
  const details = useMemo(
    () => (uni ? buildUniversityDetails(uni, country) : null),
    [uni, country]
  );

  if (!uni || !details) return <NotFound />;

  const grad = gradientFor(uni.slug);
  const related = universities.filter((u) => u.country === uni.country && u.slug !== uni.slug).slice(0, 6);
  const defaultIntake = uni.upcoming?.[0] || uni.intakes?.[0] || "";
  const applyHref = `/apply-now?university=${encodeURIComponent(uni.slug)}&intake=${encodeURIComponent(defaultIntake)}&country=${encodeURIComponent(uni.country)}`;

  const openDetails = (tabId = "overview") => {
    setTab(tabId);
    setShowDetails(true);
    requestAnimationFrame(() => {
      document.getElementById("university-details")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <>
      {/* Hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${grad} pb-20 pt-14`}>
        {uni.imageUrl ? (
          <img
            src={uni.imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        ) : null}
        <div className={`pointer-events-none absolute inset-0 ${uni.imageUrl ? "bg-ink/55" : "opacity-20"} ${uni.imageUrl ? "" : "[background-image:radial-gradient(circle_at_15%_20%,white_1.5px,transparent_1.5px)] [background-size:26px_26px]"}`} />
        <div className="container-x relative">
          <nav className="mb-8 flex items-center gap-1.5 text-sm text-white/70">
            <Link to="/" className="hover:text-white">Home</Link>
            <Icon name="chevron" className="h-4 w-4 -rotate-90" />
            <Link to="/study" className="hover:text-white">Universities</Link>
            <Icon name="chevron" className="h-4 w-4 -rotate-90" />
            <span className="text-white">{uni.name}</span>
          </nav>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <span className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white/40 bg-white font-display text-3xl font-extrabold text-ink shadow-lg">
              {uni.logoUrl ? (
                <img src={uni.logoUrl} alt="" className="h-full w-full object-contain p-2" loading="eager" decoding="async" />
              ) : (
                <span className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${grad} text-white`}>
                  {monogram(uni.name)}
                </span>
              )}
            </span>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white backdrop-blur">
                <Flag code={country?.code} className="text-xl" title={country?.name} /> {country?.name}
              </div>
              <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">{uni.name}</h1>
              <p className="mt-1.5 flex items-center gap-1.5 text-white/80"><Icon name="pin" className="h-4 w-4" /> {uni.city}</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openDetails("overview")}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-ink shadow-lg transition hover:bg-gold-400"
            >
              More about University <Icon name="arrow" className="h-5 w-5" />
            </button>
            <Link to={applyHref} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
              Talk to an Advisor
            </Link>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="container-x relative z-10 -mt-12">
        <Reveal className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-xl shadow-brand-950/5 md:grid-cols-4">
          <Fact icon="cap" label="Study Levels" value={uni.programs.length} />
          <Fact icon="book" label="Course Areas" value={uni.subjects.length} />
          <Fact icon="clock" label="Intakes / Year" value={uni.intakes.length} />
          <Fact icon="award" label="Tuition From" value={`$${uni.feeFrom.toLocaleString()}`} />
        </Reveal>
      </section>

      {/* Original summary layout */}
      <section className="container-x grid gap-8 py-12 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-8">
          <Panel title="Overview" icon="compass">
            <p className="text-sm leading-relaxed text-slate-600">{uni.overview}</p>
            <button
              type="button"
              onClick={() => openDetails("overview")}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"
            >
              More about University <Icon name="arrow" className="h-4 w-4" />
            </button>
          </Panel>

          <Panel title="Programmes" icon="cap">
            <div className="flex flex-wrap gap-2">
              {uni.programs.map((p) => (
                <Link key={p} to={`/study/${uni.country}/${p}/all`} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium capitalize text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700">
                  {programName[p] || p}
                </Link>
              ))}
            </div>
          </Panel>

          <Panel title="Courses / Categories" icon="book">
            <div className="flex flex-wrap gap-2">
              {uni.subjects.map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700">
                  <Icon name="check" className="h-3.5 w-3.5" /> {s}
                </span>
              ))}
            </div>
          </Panel>

          <Panel title="Intakes" icon="clock">
            <div className="flex flex-wrap gap-2">
              {uni.intakes.map((m) => (
                <span key={m} className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-700">{m}</span>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Reveal className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-lg">
            <h3 className="font-display text-lg font-bold">Upcoming Intakes</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {uni.upcoming.map((m) => (
                <Link
                  key={m}
                  to={`/apply-now?university=${encodeURIComponent(uni.slug)}&intake=${encodeURIComponent(m)}&country=${encodeURIComponent(uni.country)}`}
                  className="rounded-lg bg-white/15 px-3.5 py-1.5 text-sm font-semibold transition hover:bg-white/25"
                >
                  {m}
                </Link>
              ))}
            </div>
            <Link to={applyHref} className="mt-5 block rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-brand-700 transition hover:bg-gold-400 hover:text-brand-950">
              Apply for this University
            </Link>
          </Reveal>

          <Reveal delay={80} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              <Icon name="doc" className="h-5 w-5 text-brand-500" /> Required Documents
            </h3>
            <ul className="mt-4 space-y-2.5">
              {uni.docs.map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* More about University — shown after button click */}
      {showDetails && (
        <section id="university-details" className="container-x scroll-mt-24 pb-12">
          <Reveal className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">More about University</p>
                <h2 className="mt-1 font-display text-2xl font-extrabold text-ink">University details</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Overview, programmes, student life, accommodation and campus for {uni.name}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-ink"
              >
                Close
              </button>
            </div>

            <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-slate-100 px-2 pt-2 sm:px-3">
              {TABS.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-t-xl px-3.5 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100"
                        : "text-slate-500 hover:bg-slate-50 hover:text-ink"
                    }`}
                  >
                    <Icon name={t.icon} className="h-4 w-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div className="p-5 sm:p-7">
              {tab === "overview" && (
                <div className="space-y-5">
                  <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{details.overview.body}</p>
                  <ul className="grid gap-2.5 sm:grid-cols-2">
                    {details.overview.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-3 text-sm text-slate-700">
                        <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tab === "programmes" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">Study levels</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {details.programmes.levels.map((p) => (
                        <Link
                          key={p}
                          to={`/study/${uni.country}/${p}/all`}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium capitalize text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                        >
                          {programName[p] || p}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">Course areas</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {details.programmes.subjects.map((s) => (
                        <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700">
                          <Icon name="check" className="h-3.5 w-3.5" /> {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">Intakes</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {details.programmes.intakes.map((m) => (
                        <span key={m} className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-700">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === "student-life" && (
                <BulletBlock title="Life as a student" text={`What to expect while studying at ${uni.name}.`} items={details.studentLife} />
              )}

              {tab === "accommodation" && (
                <BulletBlock title="Where you can stay" text="Housing options Education Doorway can help you explore." items={details.accommodation} />
              )}

              {tab === "campus" && (
                <BulletBlock title="Campus & facilities" text={`${uni.city} campus highlights and student services.`} items={details.campus} />
              )}
            </div>
          </Reveal>
        </section>
      )}

      {related.length > 0 && (
        <section className="container-x pb-8">
          <Reveal><h2 className="font-display text-2xl font-extrabold text-ink">Related Universities</h2></Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((u, i) => (
              <Reveal key={u.slug} delay={(i % 3) * 60}>
                <Link to={`/university/${u.slug}`} className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg">
                  <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradientFor(u.slug)} font-display text-sm font-extrabold text-white`}>
                    {monogram(u.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold text-ink group-hover:text-brand-700">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.city}</p>
                  </div>
                  <Icon name="arrow" className="ml-auto h-5 w-5 text-brand-400 opacity-0 transition group-hover:opacity-100" />
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <CounsellingSection />
    </>
  );
}

function BulletBlock({ title, text, items }) {
  return (
    <div>
      <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
      {text && <p className="mt-1 text-sm text-slate-500">{text}</p>}
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-3 text-sm text-slate-700">
            <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Fact({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div>
        <p className="font-display text-lg font-extrabold text-ink">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function Panel({ title, icon, children }) {
  return (
    <Reveal className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-ink">
        <Icon name={icon} className="h-5 w-5 text-brand-500" /> {title}
      </h2>
      {children}
    </Reveal>
  );
}
