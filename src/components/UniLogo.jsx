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
    md: "h-[4.5rem] w-[4.5rem] rounded-2xl",
    lg: "h-28 w-28 rounded-3xl sm:h-32 sm:w-32",
    xl: "h-32 w-32 rounded-3xl",
  };
  const box = sizes[size] || sizes.md;
  const monoClass =
    size === "lg" || size === "xl"
      ? "text-3xl sm:text-4xl"
      : size === "sm"
        ? "text-sm"
        : "text-xl";

  return (
    <span
      className={`uni-logo uni-logo--tight ${box} ${className}`.trim()}
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
