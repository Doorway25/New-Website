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
 * Falls back to monogram initials when no real logo is available.
 */
export default function UniLogo({
  name = "",
  logoUrl = "",
  slug = "",
  size = "md",
  className = "",
}) {
  const real = hasRealLogo(logoUrl);
  const sizes = {
    sm: "h-12 w-12 rounded-xl",
    md: "h-16 w-16 rounded-2xl",
    lg: "h-20 w-20 rounded-2xl sm:h-24 sm:w-24 sm:rounded-3xl",
    xl: "h-24 w-24 rounded-3xl",
  };
  const box = sizes[size] || sizes.md;
  const monoClass =
    size === "lg" || size === "xl"
      ? "text-2xl sm:text-3xl"
      : size === "sm"
        ? "text-sm"
        : "text-lg";

  return (
    <span
      className={`uni-logo ${box} ${className}`.trim()}
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
