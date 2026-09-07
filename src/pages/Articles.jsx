import { useEffect, useMemo, useState } from "react";
import ArticleCard from "../components/ArticleCard";
import CounsellingSection from "../components/CounsellingSection";
import PageHero from "../components/PageHero";
import Pagination from "../components/Pagination";
import Reveal from "../components/Reveal";
import { useSite } from "../api/SiteContext";

const PAGE_SIZE = 6;

export default function Articles() {
  const { articles } = useSite();
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(articles.map((a) => a.category)))],
    [articles]
  );
  const [active, setActive] = useState("All");
  const [page, setPage] = useState(1);

  const list = active === "All" ? articles : articles.filter((a) => a.category === active);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const shown = list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [active]);

  return (
    <>
      <PageHero
        eyebrow="Articles"
        title="Insights & Study Abroad Guides"
        subtitle="Expert tips on applications, visas, scholarships and life abroad to guide every step of your journey."
        crumbs={[{ label: "Articles" }]}
      />
      <section className="container-x -mt-8 relative z-10 pb-8">
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === c
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-500/25"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 3) * 70}>
              <ArticleCard article={a} />
            </Reveal>
          ))}
        </div>
        <Pagination page={current} totalPages={totalPages} onChange={setPage} />
        <p className="mt-6 text-center text-sm text-slate-500">
          Showing <strong>{list.length ? (current - 1) * PAGE_SIZE + 1 : 0}</strong> to{" "}
          <strong>{Math.min(current * PAGE_SIZE, list.length)}</strong> of{" "}
          <strong>{list.length}</strong> articles
        </p>
      </section>
      <CounsellingSection />
    </>
  );
}
