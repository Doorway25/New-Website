import { gradientFor, monogram } from "../data/site";

/** True when we have a real uploaded/partner logo (not ui-avatars fallback). */
export function hasRealLogo(url) {
  const src = String(url || "").trim();
  if (!src) return false;
  if (/ui-avatars\.com/i.test(src)) return false;
  return true;
}

/**
 * Crisp university logo badge.
 * Default "md" is a wide rectangle so horizontal wordmarks fill the box
 * (square boxes leave large empty top/bottom gaps).
 */
export default function UniLogo({
  name = "",
  logoUrl = "",
  slug = "",
  size = "md",
  className = "",
}) {
  const real = hasRealLogo(logoUrl);
  // Wide badges suit real uni logos; square only for monogram fallback still works inside them
  const sizes = {
    sm: "h-11 w-16 rounded-xl",
    md: "h-14 w-[7.25rem] rounded-2xl",
    lg: "h-[5.5rem] w-[8.5rem] rounded-2xl sm:h-24 sm:w-40 sm:rounded-3xl",
    xl: "h-24 w-44 rounded-3xl",
    square: "h-16 w-16 rounded-2xl",
  };
  const box = sizes[size] || sizes.md;
  const monoClass =
    size === "lg" || size === "xl"
      ? "text-2xl sm:text-3xl"
      : size === "sm"
        ? "text-xs"
        : "text-base";

  return (
    <span
      className={`uni-logo uni-logo--fill ${box} ${className}`.trim()}
      title={name || undefined}
    >
      {real ? (
        <img
          src={logoUrl}
          alt={name ? `${name} logo` : ""}
          loading="lazy"
          decoding="async"
          className="uni-logo-img"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const fallback = e.currentTarget.nextElementSibling;
            if (fallback) fallback.hidden = false;
          }}
        />
      ) : null}
      <span
        className={`uni-logo-fallback bg-gradient-to-br ${gradientFor(slug || name)} ${monoClass}`}
        hidden={real}
      >
        {monogram(name)}
      </span>
    </span>
  );
}
