import { Link, useParams } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import CounsellingSection from "../components/CounsellingSection";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import { articleBySlug, articles, formatDate } from "../data/site";

export default function ArticleDetail() {
  const { slug } = useParams();
  const article = articleBySlug[slug];

  if (!article) {
    return (
      <section className="container-x py-24 text-center">
        <h1 className="font-display text-3xl font-extrabold text-ink">Article not found</h1>
        <p className="mt-3 text-slate-500">The article you're looking for doesn't exist or has been moved.</p>
        <Link to="/articles" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 font-semibold text-white">
          Back to Articles <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </section>
    );
  }

  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-brand-950 pb-14 pt-14">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,rgba(89,141,255,.6),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(240,180,41,.35),transparent_40%)]" />
        <div className="container-x relative max-w-3xl">
          <nav className="flex items-center gap-1.5 text-sm text-slate-400">
            <Link to="/" className="hover:text-white">Home</Link>
            <Icon name="chevron" className="h-4 w-4 -rotate-90 text-slate-500" />
            <Link to="/articles" className="hover:text-white">Articles</Link>
          </nav>
          <span className="mt-5 inline-block rounded-full bg-gold-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gold-400">
            {article.category}
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            {article.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
            <span className="flex items-center gap-2"><Icon name="users" className="h-4 w-4 text-gold-400" /> {article.author}</span>
            <span className="flex items-center gap-2"><Icon name="calendar" className="h-4 w-4 text-gold-400" /> {formatDate(article.date)}</span>
            <span className="flex items-center gap-2"><Icon name="clock" className="h-4 w-4 text-gold-400" /> {article.readTime} min read</span>
          </div>
        </div>
      </section>

      <article className="container-x -mt-8 relative z-10 max-w-3xl pb-8">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-brand-950/5">
          <div className="h-56 overflow-hidden bg-gradient-to-br from-brand-500 to-brand-800 sm:h-72">
            <img
              src={article.image}
              alt={article.title}
              onError={(e) => (e.currentTarget.style.display = "none")}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-6 sm:p-9">
            <p className="text-lg font-medium leading-relaxed text-ink">{article.excerpt}</p>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-slate-600">
              {article.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-50 p-5">
              <div>
                <p className="font-display text-lg font-bold text-ink">Have questions about this?</p>
                <p className="text-sm text-slate-500">Book a free counselling session with our experts.</p>
              </div>
              <Link to="/apply-now" className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-700">
                Get Free Guidance <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        <Link to="/articles" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline">
          <Icon name="arrow" className="h-4 w-4 rotate-180" /> Back to all articles
        </Link>
      </article>

      <section className="container-x pb-4">
        <h2 className="font-display text-2xl font-extrabold text-ink">Related Articles</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((a, i) => (
            <Reveal key={a.slug} delay={i * 70}>
              <ArticleCard article={a} />
            </Reveal>
          ))}
        </div>
      </section>

      <CounsellingSection />
    </>
  );
}
