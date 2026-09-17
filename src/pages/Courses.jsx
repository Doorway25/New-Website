import { useState } from "react";
import { Link } from "react-router-dom";
import CounsellingSection from "../components/CounsellingSection";
import Icon from "../components/Icon";
import PageHero from "../components/PageHero";
import Pagination from "../components/Pagination";
import Reveal from "../components/Reveal";
import SeoHead from "../components/SeoHead";
import { useSite } from "../api/SiteContext";

const SUBJECT_PAGE_SIZE = 12;

const programIcons = {
  foundation: "spark",
  diploma: "doc",
  undergraduate: "cap",
  postgraduate: "book",
  mres: "award",
  "postgraduate-diploma": "award",
  phd: "target",
};

export default function Courses() {
  const { programs, subjects, getPage } = useSite();
  const seoPage = getPage("courses");
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(subjects.length / SUBJECT_PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const shownSubjects = subjects.slice((current - 1) * SUBJECT_PAGE_SIZE, current * SUBJECT_PAGE_SIZE);

  return (
    <>
      <SeoHead
        seo={seoPage}
        title="Course Finder | Education Doorway"
        description="Find your course and academic level across our global university network."
        path="/courses"
      />
      <PageHero
        eyebrow={seoPage?.eyebrow || "Course Finder"}
        title={seoPage?.title || "Find Your Course"}
        subtitle={
          seoPage?.subtitle ||
          "Select your academic level to view relevant university options across our global network."
        }
        crumbs={[{ label: "Course Finder" }]}
      />

      <section className="container-x -mt-8 relative z-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p, i) => (
            <Reveal key={p.key} delay={(i % 3) * 70}>
              <Link
                to={`/study/all/${p.key}/all`}
                className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <Icon name={programIcons[p.key] || "book"} className="h-6 w-6" />
                  </span>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600">
                    {p.count} Courses
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-ink">{p.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{p.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                  Explore <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x min-w-0 overflow-x-clip py-12 sm:py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Browse by Subject</h2>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Explore {subjects.length}+ subject areas across our partner universities.
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 sm:mt-10 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
          {shownSubjects.map((s, i) => (
            <Reveal key={s} delay={Math.min(i * 25, 300)} className="min-w-0">
              <Link
                to="/study"
                className="group flex h-full min-w-0 items-start gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-600 shadow-sm transition hover:border-brand-300 hover:bg-brand-600 hover:text-white sm:rounded-full sm:items-center sm:px-4 sm:py-2.5"
              >
                <Icon name="book" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400 group-hover:text-white sm:mt-0" />
                <span className="min-w-0 break-words leading-snug">{s}</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Pagination page={current} totalPages={totalPages} onChange={setPage} />
      </section>
      <CounsellingSection />
    </>
  );
}
