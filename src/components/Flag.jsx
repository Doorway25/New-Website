// Real SVG flags (bundled by Vite). Windows' emoji font has no flag glyphs,
// so emoji flags render as letters — these SVGs look identical on every OS.
// 4x3 for rare inline use; 1x1 for circular badges (correct crop for BD/PK/NG).
import my from "flag-icons/flags/4x3/my.svg";
import au from "flag-icons/flags/4x3/au.svg";
import ca from "flag-icons/flags/4x3/ca.svg";
import fr from "flag-icons/flags/4x3/fr.svg";
import de from "flag-icons/flags/4x3/de.svg";
import ie from "flag-icons/flags/4x3/ie.svg";
import es from "flag-icons/flags/4x3/es.svg";
import ae from "flag-icons/flags/4x3/ae.svg";
import nl from "flag-icons/flags/4x3/nl.svg";
import gb from "flag-icons/flags/4x3/gb.svg";
import us from "flag-icons/flags/4x3/us.svg";
import sa from "flag-icons/flags/4x3/sa.svg";
import bd from "flag-icons/flags/4x3/bd.svg";
import pk from "flag-icons/flags/4x3/pk.svg";
import ng from "flag-icons/flags/4x3/ng.svg";

import my1 from "flag-icons/flags/1x1/my.svg";
import au1 from "flag-icons/flags/1x1/au.svg";
import ca1 from "flag-icons/flags/1x1/ca.svg";
import fr1 from "flag-icons/flags/1x1/fr.svg";
import de1 from "flag-icons/flags/1x1/de.svg";
import ie1 from "flag-icons/flags/1x1/ie.svg";
import es1 from "flag-icons/flags/1x1/es.svg";
import ae1 from "flag-icons/flags/1x1/ae.svg";
import nl1 from "flag-icons/flags/1x1/nl.svg";
import gb1 from "flag-icons/flags/1x1/gb.svg";
import us1 from "flag-icons/flags/1x1/us.svg";
import sa1 from "flag-icons/flags/1x1/sa.svg";
import bd1 from "flag-icons/flags/1x1/bd.svg";
import pk1 from "flag-icons/flags/1x1/pk.svg";
import ng1 from "flag-icons/flags/1x1/ng.svg";

const FLAGS = { my, au, ca, fr, de, ie, es, ae, nl, gb, us, sa, bd, pk, ng };
const FLAGS_SQUARE = {
  my: my1, au: au1, ca: ca1, fr: fr1, de: de1, ie: ie1, es: es1, ae: ae1,
  nl: nl1, gb: gb1, us: us1, sa: sa1, bd: bd1, pk: pk1, ng: ng1,
};

/**
 * Official Bangladesh proportions (from 4×3 standard):
 * green field, red disc center ~43.75% from left, radius ~1/3 of height.
 * Drawn in a square so circular badges fill with no white gaps.
 */
function BangladeshFlag({ className = "", title = "Bangladesh" }) {
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full align-middle ring-1 ring-black/10 ${className}`}
      title={title}
      role="img"
      aria-label={title}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <rect width="100" height="100" fill="#006a4e" />
        <circle cx="43.75" cy="50" r="33.33" fill="#f42a41" />
      </svg>
    </span>
  );
}

/**
 * @param {string} code - ISO country code (gb, bd, pk, ng, …)
 * @param {boolean} circle - circular badge (default true)
 * @param {boolean} fill - legacy: fill parent; prefer `circle` with an explicit size class
 * @param {string} className - for circle: size classes e.g. "h-7 w-7"; otherwise font-size for 4×3
 */
export default function Flag({ code, className = "", title = "", circle = true, fill = false }) {
  if (!code) return null;

  // Explicit rectangle — official 4×3 art
  if (!circle && !fill) {
    const src = FLAGS[code];
    if (!src) return null;
    return (
      <img
        src={src}
        alt={title || code}
        title={title}
        loading="lazy"
        className={`inline-block h-[1em] w-auto shrink-0 rounded-[3px] align-middle shadow-sm ring-1 ring-black/5 ${className}`}
      />
    );
  }

  const sizeClass = className.includes("h-") || className.includes("w-") || className.includes("size-")
    ? className
    : `h-[1.35em] w-[1.35em] ${className}`;

  // Bangladesh circular/fill: official proportions, full circle fill
  if (code === "bd") {
    return <BangladeshFlag className={sizeClass} title={title || "Bangladesh"} />;
  }

  const src = FLAGS_SQUARE[code] || FLAGS[code];
  if (!src) return null;

  if (fill && !circle) {
    return (
      <img
        src={src}
        alt={title || code}
        title={title}
        loading="lazy"
        className={`block h-full w-full object-cover object-center ${className}`}
      />
    );
  }

  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full align-middle ring-1 ring-black/10 ${sizeClass}`}
      title={title}
      role="img"
      aria-label={title || code}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </span>
  );
}
