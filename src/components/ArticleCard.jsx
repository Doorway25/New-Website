import { Link } from "react-router-dom";
import Icon from "./Icon";
import { formatDate, gradientFor } from "../data/site";

export default function ArticleCard({ article }) {
  const grad = gradientFor(article.slug);
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10"
    >
      <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${grad}`}>
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          onError={(e) => (e.currentTarget.style.display = "none")}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-700 shadow-sm backdrop-blur">
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><Icon name="calendar" className="h-3.5 w-3.5" /> {formatDate(article.date)}</span>
          <span className="flex items-center gap-1.5"><Icon name="clock" className="h-3.5 w-3.5" /> {article.readTime} min read</span>
        </div>
        <h3 className="mt-2.5 line-clamp-2 font-display text-[17px] font-bold leading-snug text-ink group-hover:text-brand-700">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">{article.excerpt}</p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-400">By <span className="font-semibold text-ink">{article.author}</span></span>
          <span className="flex items-center gap-1 text-sm font-semibold text-brand-600 transition-transform group-hover:translate-x-0.5">
            Read <Icon name="arrow" className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
