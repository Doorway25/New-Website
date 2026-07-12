import { Link } from "react-router-dom";
import { company } from "../data/site";

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-lg shadow-brand-500/30">
        <span className="font-display text-lg font-extrabold">A</span>
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-gold-500 ring-2 ring-white" />
      </span>
      <span className="leading-tight">
        <span className={`block font-display text-[17px] font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}>
          Abroad <span className="text-brand-500">Study</span>
        </span>
        <span className={`block text-[11px] font-medium ${light ? "text-white/60" : "text-slate-400"}`}>
          {company.tagline}
        </span>
      </span>
    </Link>
  );
}
