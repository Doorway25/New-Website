import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function PageHero({ eyebrow, title, subtitle, crumbs = [] }) {
  return (
    <section className="relative overflow-hidden bg-brand-950 pb-16 pt-14">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,rgba(89,141,255,.6),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(240,180,41,.35),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="container-x relative text-center">
        {eyebrow && (
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" /> {eyebrow}
          </span>
        )}
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">{subtitle}</p>}

        <nav className="mt-6 flex items-center justify-center gap-1.5 text-sm text-slate-400">
          <Link to="/" className="hover:text-white">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5">
              <Icon name="chevron" className="h-4 w-4 -rotate-90 text-slate-500" />
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
