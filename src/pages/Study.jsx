import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import PageHero from "../components/PageHero";
import UniversityCard from "../components/UniversityCard";
import Pagination from "../components/Pagination";
import CounsellingSection from "../components/CounsellingSection";
import {
  universities, countries, countryBySlug, programs, subjects,
} from "../data/site";

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const subjectBySlug = Object.fromEntries(subjects.map((s) => [slug(s), s]));

const PAGE_SIZE = 9;

export default function Study() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const country = params.country && params.country !== "all" ? params.country : "all";
  const program = params.program && params.program !== "all" ? params.program : "all";
  const course = params.course && params.course !== "all" ? params.course : "all";
  const region = searchParams.get("region") || "all";

  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const go = (next) => {
    const c = next.country ?? country;
    const p = next.program ?? program;
    const co = next.course ?? course;
    setPage(1);
    if (c === "all" && p === "all" && co === "all") navigate("/study");
    else navigate(`/study/${c}/${p}/${co}`);
  };

  const filtered = useMemo(() => {
    let list = universities.filter((u) => {
      if (country !== "all" && u.country !== country) return false;
      if (region !== "all" && countryBySlug[u.country]?.region !== region) return false;
      if (program !== "all" && !u.programs.includes(program)) return false;
      if (course !== "all") {
        const subj = subjectBySlug[course];
        if (subj && !u.subjects.includes(subj)) return false;
      }
      return true;
    });
    if (sort === "low") list = [...list].sort((a, b) => a.feeFrom - b.feeFrom);
    if (sort === "high") list = [...list].sort((a, b) => b.feeFrom - a.feeFrom);
    return list;
  }, [country, program, course, region, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const scopeLabel =
    region !== "all"
      ? region.charAt(0) + region.slice(1).toLowerCase()
      : country !== "all"
      ? countryBySlug[country]?.name
      : "Global";

  const hasFilters = country !== "all" || program !== "all" || course !== "all" || region !== "all";

  return (
    <>
      <PageHero
        eyebrow="Top Universities"
        title={`Universities in ${scopeLabel}`}
        subtitle={`Currently showcasing ${filtered.length} of ${universities.length} partner universities.`}
        crumbs={[{ label: "Universities", to: "/study" }, ...(country !== "all" ? [{ label: countryBySlug[country]?.name }] : [])]}
      />

      <section className="container-x -mt-8 relative z-10">
        <Reveal className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xl shadow-brand-950/5 sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
            <Icon name="filter" className="h-5 w-5 text-brand-500" /> Filter Universities
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select label="Country" value={country} onChange={(v) => go({ country: v })}
              options={[{ v: "all", l: "All Countries" }, ...countries.map((c) => ({ v: c.slug, l: c.name }))]} />
            <Select label="Program" value={program} onChange={(v) => go({ program: v })}
              options={[{ v: "all", l: "All Programs" }, ...programs.map((p) => ({ v: p.key, l: p.name }))]} />
            <Select label="Course" value={course} onChange={(v) => go({ course: v })}
              options={[{ v: "all", l: "All Courses" }, ...subjects.map((s) => ({ v: slug(s), l: s }))]} />
            <Select label="Sort by fee" value={sort} onChange={setSort}
              options={[{ v: "", l: "Featured" }, { v: "high", l: "High → Low" }, { v: "low", l: "Low → High" }]} />
          </div>
          {hasFilters && (
            <button onClick={() => { setSort(""); navigate("/study"); }} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-500 hover:text-rose-600">
              <Icon name="close" className="h-4 w-4" /> Reset Filters
            </button>
          )}
        </Reveal>
      </section>

      <section className="container-x py-10">
        {shown.length > 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((u, i) => (
                <Reveal key={u.slug} delay={(i % 3) * 70}>
                  <UniversityCard uni={u} />
                </Reveal>
              ))}
            </div>

            <Pagination page={current} totalPages={totalPages} onChange={setPage} />
            <p className="mt-6 text-center text-sm text-slate-500">
              Showing <strong>{(current - 1) * PAGE_SIZE + 1}</strong> to{" "}
              <strong>{Math.min(current * PAGE_SIZE, filtered.length)}</strong> of{" "}
              <strong>{filtered.length}</strong> universities
            </p>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Icon name="compass" className="h-7 w-7" />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-ink">No universities match your filters</h3>
            <p className="mt-1.5 text-sm text-slate-500">Try adjusting or resetting your filters to see more options.</p>
            <Link to="/study" className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
              Reset Filters
            </Link>
          </div>
        )}
      </section>
      <CounsellingSection />
    </>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-ink outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
        >
          {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
        <Icon name="chevron" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  );
}
