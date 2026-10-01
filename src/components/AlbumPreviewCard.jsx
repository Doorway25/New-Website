import { Link } from "react-router-dom";
import Icon from "./Icon";

/** Event gallery album card — image + footer flush (no empty gap). */
export default function AlbumPreviewCard({ album }) {
  const cover = album?.images?.[0];
  const count = album?.images?.length || 0;
  const name = album?.name || "Album";
  const key = album?.key || "";

  return (
    <Link
      to={`/events/gallery/${encodeURIComponent(key)}`}
      className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/15"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-200 sm:aspect-[5/3]">
        {cover ? (
          <img
            src={cover}
            alt={name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-950" />
        )}
        <div
          className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4"
          style={{ backgroundColor: "#0d157b" }}
        >
          <div className="min-w-0">
            <h2 className="truncate font-display text-base font-bold text-white sm:text-lg">{name}</h2>
            <p className="mt-0.5 text-xs font-medium text-white/75">
              {count} photo{count === 1 ? "" : "s"}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-[#0d157b] shadow-lg transition group-hover:bg-gold-400 group-hover:text-brand-950">
            View all <Icon name="arrow" className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
