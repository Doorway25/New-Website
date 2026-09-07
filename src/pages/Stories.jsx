import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CounsellingSection from "../components/CounsellingSection";
import PageHero from "../components/PageHero";
import Pagination from "../components/Pagination";
import Reveal from "../components/Reveal";
import StoryCard from "../components/StoryCard";
import SeoHead from "../components/SeoHead";
import { useSite } from "../api/SiteContext";

const PAGE_SIZE = 6;

export default function Stories() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { stories, storyCategories, storyCategoryByKey, getPage } = useSite();
  const seoPage = getPage("stories");
  const tabs = [{ key: "all", label: "All Stories" }, ...storyCategories.map((c) => ({ key: c.key, label: c.label }))];
  const active = category && storyCategoryByKey[category] ? category : "all";

  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [active]);

  const list = active === "all" ? stories : stories.filter((s) => s.roleKey === active);
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const shown = list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const activeCat = storyCategoryByKey[active];

  return (
    <>
      <SeoHead
        seo={seoPage}
        title="Success Stories | Education Doorway"
        description="Watch real stories from guardians, students and university delegates on our YouTube channel."
        path="/stories"
      />
      <PageHero
        eyebrow="Video Testimonials"
        title={activeCat ? activeCat.label : "Success Stories"}
        subtitle={
          activeCat
            ? activeCat.blurb
            : "Watch real stories from guardians, students and university delegates on our YouTube channel."
        }
        crumbs={[{ label: "Stories", to: "/stories" }, ...(activeCat ? [{ label: activeCat.short }] : [])]}
      />

      <section className="container-x -mt-8 relative z-10 pb-8">
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => navigate(t.key === "all" ? "/stories" : `/stories/${t.key}`)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === t.key
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-500/25"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 70}>
              <StoryCard story={s} />
            </Reveal>
          ))}
        </div>

        <Pagination page={current} totalPages={totalPages} onChange={setPage} />
        <p className="mt-6 text-center text-sm text-slate-500">
          Showing <strong>{(current - 1) * PAGE_SIZE + 1}</strong> to{" "}
          <strong>{Math.min(current * PAGE_SIZE, list.length)}</strong> of{" "}
          <strong>{list.length}</strong> videos
        </p>
      </section>

      <CounsellingSection />
    </>
  );
}
