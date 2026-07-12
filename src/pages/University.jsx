import { Link, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import Flag from "../components/Flag";
import Reveal from "../components/Reveal";
import CounsellingSection from "../components/CounsellingSection";
import {
  universities, universityBySlug, countryBySlug, gradientFor, monogram, programs,
} from "../data/site";
import NotFound from "./NotFound";

const programName = Object.fromEntries(programs.map((p) => [p.key, p.name]));

export default function University() {
  const { slug } = useParams();
  const uni = universityBySlug[slug];
  if (!uni) return <NotFound />;

  const country = countryBySlug[uni.country];
  const grad = gradientFor(uni.slug);
  const related = universities.filter((u) => u.country === uni.country && u.slug !== uni.slug).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${grad} pb-20 pt-14`}>
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_15%_20%,white_1.5px,transparent_1.5px)] [background-size:26px_26px]" />
        <div className="container-x relative">
          <nav className="mb-8 flex items-center gap-1.5 text-sm text-white/70">
            <Link to="/" className="hover:text-white">Home</Link>
            <Icon name="chevron" className="h-4 w-4 -rotate-90" />
            <Link to="/study" className="hover:text-white">Universities</Link>
            <Icon name="chevron" className="h-4 w-4 -rotate-90" />
            <span className="text-white">{uni.name}</span>
          </nav>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-white/30 bg-white/10 font-display text-3xl font-extrabold text-white backdrop-blur">
              {monogram(uni.name)}
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
            <Link to="/apply-now" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-ink shadow-lg transition hover:bg-gold-400">
              View Available Courses <Icon name="arrow" className="h-5 w-5" />
            </Link>
            <Link to="/contact-us" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
              Talk to an Advisor
            </Link>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="container-x -mt-12 relative z-10">
        <Reveal className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-xl shadow-brand-950/5 md:grid-cols-4">
          <Fact icon="cap" label="Study Levels" value={uni.programs.length} />
          <Fact icon="book" label="Course Areas" value={uni.subjects.length} />
          <Fact icon="clock" label="Intakes / Year" value={uni.intakes.length} />
          <Fact icon="award" label="Tuition From" value={`$${uni.feeFrom.toLocaleString()}`} />
        </Reveal>
      </section>

      <section className="container-x grid gap-8 py-12 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-8">
          <Panel title="Overview" icon="compass">
            <p className="text-sm leading-relaxed text-slate-600">{uni.overview}</p>
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

        {/* Sidebar */}
        <div className="space-y-6">
          <Reveal className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-lg">
            <h3 className="font-display text-lg font-bold">Upcoming Intakes</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {uni.upcoming.map((m) => (
                <span key={m} className="rounded-lg bg-white/15 px-3.5 py-1.5 text-sm font-semibold">{m}</span>
              ))}
            </div>
            <Link to="/apply-now" className="mt-5 block rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-brand-700 transition hover:bg-gold-400 hover:text-brand-950">
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

      {/* Related */}
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
