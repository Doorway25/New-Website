import Reveal from "./Reveal";

export default function SectionHeading({ eyebrow, title, subtitle, center = true, light = false }) {
  return (
    <Reveal className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && (
        <span
          className={`mb-3 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider ${
            light ? "bg-white/10 text-gold-400" : "bg-brand-50 text-brand-600"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
          {eyebrow}
        </span>
      )}
      <h2 className={`font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3.5 text-base leading-relaxed ${light ? "text-slate-300" : "text-slate-500"}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
