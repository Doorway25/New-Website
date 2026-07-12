// Real SVG flags (bundled by Vite). Windows' emoji font has no flag glyphs,
// so emoji flags render as letters — these SVGs look identical on every OS.
// Only the flags we actually use are imported, keeping the bundle small.
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

const FLAGS = { my, au, ca, fr, de, ie, es, ae, nl, gb, us, sa };

// Size scales with font-size: pass a text-* class (e.g. text-4xl) via className.
// `fill` makes the flag cover its parent (used inside circular badges).
export default function Flag({ code, className = "", title = "", fill = false }) {
  const src = FLAGS[code];
  if (!src) return null;
  return (
    <img
      src={src}
      alt={title || code}
      title={title}
      loading="lazy"
      className={
        fill
          ? `h-full w-full object-cover ${className}`
          : `inline-block h-[1em] w-auto shrink-0 rounded-[3px] align-middle shadow-sm ring-1 ring-black/5 ${className}`
      }
    />
  );
}
