// Real SVG flags (bundled) + flagcdn fallback for any ISO code.
// Prefer uploaded `src` (admin Flag image), then local SVG, then CDN.
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
import cy from "flag-icons/flags/4x3/cy.svg";
import mt from "flag-icons/flags/4x3/mt.svg";
import it from "flag-icons/flags/4x3/it.svg";
import nz from "flag-icons/flags/4x3/nz.svg";
import sg from "flag-icons/flags/4x3/sg.svg";
import inFlag from "flag-icons/flags/4x3/in.svg";

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
import cy1 from "flag-icons/flags/1x1/cy.svg";
import mt1 from "flag-icons/flags/1x1/mt.svg";
import it1 from "flag-icons/flags/1x1/it.svg";
import nz1 from "flag-icons/flags/1x1/nz.svg";
import sg1 from "flag-icons/flags/1x1/sg.svg";
import in1 from "flag-icons/flags/1x1/in.svg";

const FLAGS = {
  my, au, ca, fr, de, ie, es, ae, nl, gb, us, sa, bd, pk, ng, cy, mt, it, nz, sg, in: inFlag,
};
const FLAGS_SQUARE = {
  my: my1, au: au1, ca: ca1, fr: fr1, de: de1, ie: ie1, es: es1, ae: ae1,
  nl: nl1, gb: gb1, us: us1, sa: sa1, bd: bd1, pk: pk1, ng: ng1, cy: cy1,
  mt: mt1, it: it1, nz: nz1, sg: sg1, in: in1,
};

/** Normalize common aliases → ISO 3166-1 alpha-2 */
export function normalizeFlagCode(raw) {
  const c = String(raw || "").trim().toLowerCase();
  if (!c) return "";
  const map = {
    uk: "gb",
    "united-kingdom": "gb",
    britain: "gb",
    england: "gb",
    usa: "us",
    "united-states": "us",
    uae: "ae",
    ksa: "sa",
    "saudi-arabia": "sa",
    malaysia: "my",
    cyprus: "cy",
    malta: "mt",
    australia: "au",
    canada: "ca",
    france: "fr",
    germany: "de",
    ireland: "ie",
    spain: "es",
    netherlands: "nl",
    bangladesh: "bd",
    pakistan: "pk",
    nigeria: "ng",
    india: "in",
    singapore: "sg",
    "new-zealand": "nz",
    italy: "it",
  };
  if (map[c]) return map[c];
  if (/^[a-z]{2}$/.test(c)) return c;
  return "";
}

function cdnFlagUrl(code, square = true) {
  const c = normalizeFlagCode(code);
  if (!c) return "";
  return square
    ? `https://flagcdn.com/w160/${c}.png`
    : `https://flagcdn.com/w80/${c}.png`;
}

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

function CircleFlag({ src, title, className }) {
  if (!src) return null;
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full align-middle ring-1 ring-black/10 ${className}`}
      title={title}
      role="img"
      aria-label={title || "Flag"}
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

/**
 * @param {string} [src] - uploaded flag image URL (preferred when set)
 * @param {string} [code] - ISO / alias country code
 */
export default function Flag({ src: customSrc, code, className = "", title = "", circle = true, fill = false }) {
  const sizeClass =
    className.includes("h-") || className.includes("w-") || className.includes("size-")
      ? className
      : `h-[1.35em] w-[1.35em] ${className}`;

  const iso = normalizeFlagCode(code);
  const upload = String(customSrc || "").trim();

  // 1) Admin-uploaded flag image
  if (upload) {
    if (fill && !circle) {
      return (
        <img
          src={upload}
          alt={title || "Flag"}
          title={title}
          loading="lazy"
          className={`block h-full w-full object-cover object-center ${className}`}
        />
      );
    }
    if (!circle && !fill) {
      return (
        <img
          src={upload}
          alt={title || "Flag"}
          title={title}
          loading="lazy"
          className={`inline-block h-[1em] w-auto shrink-0 rounded-[3px] object-cover align-middle shadow-sm ring-1 ring-black/5 ${className}`}
        />
      );
    }
    return <CircleFlag src={upload} title={title} className={sizeClass} />;
  }

  if (!iso) return null;

  if (iso === "bd" && (circle || fill)) {
    return <BangladeshFlag className={sizeClass} title={title || "Bangladesh"} />;
  }

  const local = circle || fill ? FLAGS_SQUARE[iso] || FLAGS[iso] : FLAGS[iso];
  const src = local || cdnFlagUrl(iso, circle || fill);
  if (!src) return null;

  if (!circle && !fill) {
    return (
      <img
        src={src}
        alt={title || iso}
        title={title}
        loading="lazy"
        className={`inline-block h-[1em] w-auto shrink-0 rounded-[3px] align-middle shadow-sm ring-1 ring-black/5 ${className}`}
      />
    );
  }

  if (fill && !circle) {
    return (
      <img
        src={src}
        alt={title || iso}
        title={title}
        loading="lazy"
        className={`block h-full w-full object-cover object-center ${className}`}
      />
    );
  }

  return <CircleFlag src={src} title={title || iso} className={sizeClass} />;
}
