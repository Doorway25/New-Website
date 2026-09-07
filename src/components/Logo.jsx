import { Link } from "react-router-dom";
import { useSite } from "../api/SiteContext";

/**
 * Brand wordmark logos (full horizontal lockups).
 * Navbar + footer both use ~200px wide (height scales with aspect ratio).
 */
export default function Logo({ light = false }) {
  const { company } = useSite();
  const src = light ? "/logo-white.png" : "/logo-color.png";

  return (
    <Link to="/" className="inline-flex min-w-0 items-center" aria-label={company.name}>
      <img
        src={src}
        alt={company.name}
        width={200}
        height={69}
        className="h-auto w-[200px] max-w-full object-contain object-left"
      />
    </Link>
  );
}
