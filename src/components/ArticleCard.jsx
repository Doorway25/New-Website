import { Link } from "react-router-dom";
import Icon from "./Icon";
import { formatDate } from "../data/site";

/** Shared media frame — image always fills box (no letterbox gaps). */
function CardMedia({ src, alt, children, className = "" }) {
  return (
    <div className={`card-media ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="card-media-img"
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />
      ) : null}
      {children}
    </div>
  );
}

export default function ArticleCard({ article }) {
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10"
    >
      <CardMedia src={article.image} alt={article.title} className="card-media--article">
        <span className="absolute left-3 top-3 z-[1] rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-700 shadow-sm backdrop-blur">
          {article.category}
        </span>
      </CardMedia>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Icon name="calendar" className="h-3.5 w-3.5" /> {formatDate(article.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="clock" className="h-3.5 w-3.5" /> {article.readTime} min read
          </span>
        </div>
        <h3 className="mt-2.5 line-clamp-3 font-display text-[17px] font-bold leading-snug text-ink group-hover:text-brand-700">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">{article.excerpt}</p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-400">
            By <span className="font-semibold text-ink">{article.author}</span>
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-brand-600 transition-transform group-hover:translate-x-0.5">
            Read <Icon name="arrow" className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export { CardMedia };
