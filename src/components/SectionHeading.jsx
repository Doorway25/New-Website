import Reveal from "./Reveal";

export default function SectionHeading({ eyebrow, title, subtitle, center = true, light = false, reveal = true }) {
  const content = (
    <>
      {eyebrow && (
        <span
          className={`mb-2 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider ${
            light ? "border border-white/80 bg-white/95 text-brand-700 shadow-sm backdrop-blur" : "bg-brand-50 text-brand-600"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
          {eyebrow}
        </span>
      )}
      <h2 className={`font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl md:text-4xl ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2.5 text-sm leading-relaxed sm:mt-3.5 sm:text-base ${light ? "text-slate-300" : "text-slate-500"}`}>
          {subtitle}
        </p>
      )}
    </>
  );

  if (!reveal) {
    return <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>{content}</div>;
  }

  return (
    <Reveal className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {content}
    </Reveal>
  );
}
