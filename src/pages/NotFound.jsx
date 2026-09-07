import { Link } from "react-router-dom";
import Icon from "../components/Icon";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-brand-950 px-6 py-20 text-center">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_30%,rgba(0,178,255,.55),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(79,210,255,.3),transparent_40%)]" />
      <div className="relative">
        <p className="font-display text-8xl font-black text-white/90 sm:text-9xl">404</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-white">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-slate-300">
          The page you're looking for doesn't exist or has moved. Let's get you back on track.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-brand-700 transition hover:bg-gold-400">
            <Icon name="arrow" className="h-5 w-5 rotate-180" /> Back to Home
          </Link>
          <Link to="/study" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
            Browse Universities
          </Link>
        </div>
      </div>
    </section>
  );
}
