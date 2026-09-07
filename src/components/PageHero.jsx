import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function PageHero({ eyebrow, title, subtitle, crumbs = [] }) {
  return (
    <section className="relative overflow-hidden bg-brand-950 pb-12 pt-10 sm:pb-16 sm:pt-14">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,rgba(0,178,255,.55),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(79,210,255,.3),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="container-x relative text-center">
        {eyebrow && (
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-700 shadow-sm backdrop-blur sm:mb-4 sm:px-3.5 sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" /> {eyebrow}
          </span>
        )}
        <h1 className="font-display text-[1.75rem] font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:mt-4 sm:text-base md:text-lg">
            {subtitle}
          </p>
        )}

        <nav className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-400 sm:mt-6 sm:text-sm">
          <Link to="/" className="hover:text-white">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5">
              <Icon name="chevron" className="h-3.5 w-3.5 -rotate-90 text-slate-500 sm:h-4 sm:w-4" />
              {c.to ? (
                <Link to={c.to} className="hover:text-white">{c.label}</Link>
              ) : (
                <span className="text-gold-400">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
