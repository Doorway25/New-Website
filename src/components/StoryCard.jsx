import { Link } from "react-router-dom";
import { useState } from "react";
import Icon from "./Icon";
import { youtubeThumbCandidates } from "../api/client";

function PlayIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.28-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function storyDescription(story) {
  if (Array.isArray(story.text) && story.text.length) {
    return story.text[0];
  }
  if (typeof story.text === "string" && story.text.trim()) {
    return story.text.trim().split(/\n+/)[0];
  }
  return story.relation || "";
}

function StoryThumb({ story }) {
  const candidates = story.youtubeId
    ? youtubeThumbCandidates(story.youtubeId)
    : story.image
      ? [story.image]
      : [];
  const [index, setIndex] = useState(0);
  const src = candidates[index] || "";

  if (!src) {
    return <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-900" />;
  }

  // hqdefault has black letterbox bars — scale slightly to crop them out
  const isHqFallback = /\/hqdefault\.jpg$/i.test(src);

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => {
        if (index < candidates.length - 1) setIndex((i) => i + 1);
      }}
      className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
        isHqFallback ? "scale-[1.34] group-hover:scale-[1.4]" : ""
      }`}
    />
  );
}

export default function StoryCard({ story }) {
  const hasVideo = Boolean(story.youtubeId);
  const title = story.quote || story.name || "Story";
  const description = storyDescription(story);

  return (
    <Link
      to={`/story/${story.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10"
    >
      {/* Full 16:9 thumbnail — no dark header bar */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <StoryThumb story={story} />
        {hasVideo ? (
          <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition group-hover:bg-black/20">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-700 shadow-lg transition-transform group-hover:scale-110">
              <PlayIcon className="h-6 w-6" />
            </span>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {story.role ? (
          <span className="mb-2 w-fit rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700">
            {story.role}
          </span>
        ) : null}
        <h3 className="line-clamp-2 font-display text-[15px] font-bold leading-snug text-ink group-hover:text-brand-700">
          {title}
        </h3>
        {description ? (
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">{description}</p>
        ) : null}
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-transform group-hover:translate-x-0.5">
          {hasVideo ? "Watch on YouTube" : "Read story"} <Icon name="arrow" className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
