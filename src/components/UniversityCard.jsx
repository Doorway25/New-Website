import { Link } from "react-router-dom";
import { countryBySlug, gradientFor } from "../data/site";
import { formatTuition } from "../utils/currency";
import Flag from "./Flag";
import Icon from "./Icon";
import UniLogo from "./UniLogo";

export default function UniversityCard({ uni }) {
  const country = countryBySlug[uni.country] || countryBySlug[uni.countrySlug];
  const grad = gradientFor(uni.slug);
  const cover = uni.imageUrl || "";

  return (
    <Link
      to={`/university/${uni.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10"
    >
      <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${grad}`}>
        {cover ? (
          <img
            src={cover}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/10 to-transparent" />
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
          <Flag code={country?.code} className="text-sm" title={country?.name} />{" "}
          {country?.name?.split(" ")[0] || (uni.country || "").toUpperCase()}
        </div>
        <div className="absolute -bottom-6 left-4">
          <UniLogo
            name={uni.name}
            logoUrl={uni.logoUrl}
            slug={uni.slug}
            size="md"
            className="border-[3px] border-white shadow-lg"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 pt-9">
        <h3 className="line-clamp-2 font-display text-[17px] font-bold leading-snug text-ink group-hover:text-brand-700">
          {uni.name}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
          <Icon name="pin" className="h-4 w-4 text-brand-400" /> {uni.city}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(uni.programs || []).slice(0, 3).map((p) => (
            <span
              key={p}
              className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium capitalize text-brand-600"
            >
              {p.replace("-", " ")}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-400">
            From <span className="font-semibold text-ink">{formatTuition(uni.feeFrom, uni.country || uni.countrySlug)}</span>/yr
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-brand-600 transition-transform group-hover:translate-x-0.5">
            View <Icon name="arrow" className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
