import { Link } from "react-router-dom";
import Icon from "./Icon";

function PlayIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.28-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

export default function StoryCard({ story }) {
  const hasVideo = Boolean(story.youtubeId);

  return (
    <Link
      to={`/story/${story.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10"
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-600 to-brand-900">
        {story.image ? (
          <img
            src={story.image}
            alt={story.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-110"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {hasVideo ? (
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand-700 shadow-lg transition-transform group-hover:scale-110">
            <PlayIcon className="h-6 w-6" />
          </span>
        ) : null}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-700 backdrop-blur">
          {story.role}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <blockquote className="flex-1 text-sm font-medium leading-relaxed text-ink">"{story.quote}"</blockquote>
        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-sm font-bold text-ink">{story.name}</p>
          <p className="mt-0.5 text-xs text-slate-500">{story.relation}</p>
        </div>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-transform group-hover:translate-x-0.5">
          {hasVideo ? "Watch video" : "Read story"} <Icon name="arrow" className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
