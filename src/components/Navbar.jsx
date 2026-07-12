import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Icon from "./Icon";
import Flag from "./Flag";
import Logo from "./Logo";
import { company, countries, programs, subjects } from "../data/site";

const regions = [
  { key: "ASIA", label: "Asia" },
  { key: "AUSTRALIA", label: "Australia" },
  { key: "EUROPE", label: "Europe" },
  { key: "AMERICA", label: "America" },
];

function Dropdown({ label, children, wide }) {
  return (
    <li className="group relative">
      <button className="flex items-center gap-1 px-3.5 py-2 text-[15px] font-medium text-slate-700 transition-colors hover:text-brand-600">
        {label}
        <Icon name="chevron" className="w-4 h-4 transition-transform group-hover:rotate-180" />
      </button>
      <div
        className={`invisible absolute left-1/2 top-full z-40 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${
          wide ? "w-[640px]" : "w-72"
        }`}
      >
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl shadow-brand-950/10 ring-1 ring-black/5">
          {children}
        </div>
      </div>
    </li>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSub(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  const navLink = ({ isActive }) =>
    `px-3.5 py-2 text-[15px] font-medium transition-colors ${
      isActive ? "text-brand-600" : "text-slate-700 hover:text-brand-600"
    }`;

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="hidden bg-brand-950 text-white/90 md:block">
        <div className="container-x flex h-10 items-center justify-between text-[13px]">
          <div className="flex items-center gap-6">
            <a href={`tel:${company.phone}`} className="flex items-center gap-1.5 hover:text-gold-400">
              <Icon name="phone" className="h-3.5 w-3.5" /> {company.phone}
            </a>
            <a href={`mailto:${company.email}`} className="flex items-center gap-1.5 hover:text-gold-400">
              <Icon name="mail" className="h-3.5 w-3.5" /> {company.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Icon name="clock" className="h-3.5 w-3.5" /> {company.hours}
            </span>
            <span className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              {company.socials.map((s) => (
                <a key={s.icon} href={s.href} aria-label={s.label} className="text-white/70 hover:text-gold-400">
                  <Icon name={s.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={`border-b transition-all ${
          scrolled
            ? "border-slate-200 bg-white/90 backdrop-blur-md shadow-sm"
            : "border-transparent bg-white"
        }`}
      >
        <div className="container-x flex h-[68px] items-center justify-between gap-4">
          <Logo />

          <ul className="hidden items-center lg:flex">
            <li>
              <NavLink to="/" end className={navLink}>Home</NavLink>
            </li>

            <Dropdown label="Countries">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Study Destinations</p>
              <div className="grid grid-cols-2 gap-1">
                {countries.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/study/${c.slug}`}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <Flag code={c.code} className="text-base" title={c.name} />
                    <span className="truncate">{c.name}</span>
                  </Link>
                ))}
              </div>
              <Link to="/countries" className="mt-2 block rounded-lg bg-brand-50 px-3 py-2 text-center text-sm font-semibold text-brand-700 hover:bg-brand-100">
                View all countries
              </Link>
            </Dropdown>

            <Dropdown label="Courses" wide>
              <div className="grid grid-cols-[1fr_1.4fr] gap-4">
                <div>
                  <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Programmes</p>
                  <div className="grid gap-1">
                    {programs.map((p) => (
                      <Link
                        key={p.key}
                        to={`/study/all/${p.key}/all`}
                        className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                      >
                        <span>{p.name}</span>
                        <span className="text-xs text-slate-400">{p.count}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Top Subjects</p>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                    {subjects.slice(0, 16).map((s) => (
                      <Link
                        key={s}
                        to="/courses"
                        className="truncate rounded-lg px-2 py-1.5 text-[13px] text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                      >
                        {s}
                      </Link>
                    ))}
                  </div>
                  <Link to="/courses" className="mt-1 block px-2 text-sm font-semibold text-brand-600 hover:underline">
                    All subjects →
                  </Link>
                </div>
              </div>
            </Dropdown>

            <Dropdown label="Universities">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Top Destinations</p>
              <div className="grid gap-1">
                {countries.slice(0, 5).map((c) => (
                  <Link
                    key={c.slug}
                    to={`/study/${c.slug}`}
                    className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <span className="flex items-center gap-2">
                      <Flag code={c.code} className="text-base" title={c.name} /> {c.name}
                    </span>
                    {c.slug === "uk" && (
                      <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-600">
                        Popular
                      </span>
                    )}
                  </Link>
                ))}
              </div>
              <p className="px-2 pb-2 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Browse by region</p>
              <div className="grid grid-cols-2 gap-1">
                {regions.map((r) => (
                  <Link
                    key={r.key}
                    to={`/study?region=${r.key}`}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <Icon name="globe" className="h-4 w-4 text-brand-500" />
                    {r.label}
                  </Link>
                ))}
              </div>
              <Link to="/study" className="mt-3 block rounded-lg bg-brand-50 px-3 py-2 text-center text-sm font-semibold text-brand-700 hover:bg-brand-100">
                All universities
              </Link>
            </Dropdown>

            <li><NavLink to="/articles" className={navLink}>Articles</NavLink></li>
            <li><NavLink to="/events" className={navLink}>Events</NavLink></li>
            <li><NavLink to="/about-us" className={navLink}>About Us</NavLink></li>
            <li><NavLink to="/contact-us" className={navLink}>Contact Us</NavLink></li>
          </ul>

          <div className="flex items-center gap-2">
            <Link
              to="/apply-now"
              className="hidden rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:shadow-brand-500/40 hover:brightness-110 sm:inline-flex"
            >
              Apply Now
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
              aria-label="Toggle menu"
            >
              <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 top-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[84%] max-w-sm overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} className="rounded-lg border border-slate-200 p-2" aria-label="Close">
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <MobileLink to="/" label="Home" />
            <MobileAccordion label="Countries" open={sub === "c"} onToggle={() => setSub(sub === "c" ? null : "c")}>
              <div className="grid grid-cols-2 gap-1 pb-2">
                {countries.map((c) => (
                  <Link key={c.slug} to={`/study/${c.slug}`} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-brand-50">
                    <Flag code={c.code} className="text-base" title={c.name} /> <span className="truncate">{c.name}</span>
                  </Link>
                ))}
              </div>
              <Link to="/countries" className="block px-2 text-sm font-semibold text-brand-600">View all countries →</Link>
            </MobileAccordion>
            <MobileAccordion label="Courses" open={sub === "p"} onToggle={() => setSub(sub === "p" ? null : "p")}>
              {programs.map((p) => (
                <Link key={p.key} to={`/study/all/${p.key}/all`} className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-brand-50">
                  <span>{p.name}</span><span className="text-xs text-slate-400">{p.count}</span>
                </Link>
              ))}
              <Link to="/courses" className="block px-2 pt-1 text-sm font-semibold text-brand-600">All courses →</Link>
            </MobileAccordion>
            <MobileAccordion label="Universities" open={sub === "u"} onToggle={() => setSub(sub === "u" ? null : "u")}>
              {countries.slice(0, 5).map((c) => (
                <Link key={c.slug} to={`/study/${c.slug}`} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-brand-50">
                  <Flag code={c.code} className="text-base" title={c.name} /> {c.name}
                  {c.slug === "uk" && <span className="ml-auto rounded-full bg-gold-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-gold-600">Popular</span>}
                </Link>
              ))}
              <div className="mt-1 flex flex-wrap gap-1 px-2">
                {regions.map((r) => (
                  <Link key={r.key} to={`/study?region=${r.key}`} className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-600 hover:bg-brand-50">{r.label}</Link>
                ))}
              </div>
              <Link to="/study" className="block px-2 pt-2 text-sm font-semibold text-brand-600">All universities →</Link>
            </MobileAccordion>
            <MobileLink to="/articles" label="Articles" />
            <MobileLink to="/events" label="Events" />
            <MobileLink to="/about-us" label="About Us" />
            <MobileLink to="/contact-us" label="Contact Us" />
            <Link
              to="/apply-now"
              className="mt-4 block rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-3 text-center text-sm font-semibold text-white shadow-lg"
            >
              Apply Now
            </Link>
            <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
              <a href={`tel:${company.phone}`} className="flex items-center gap-2"><Icon name="phone" className="h-4 w-4" /> {company.phone}</a>
              <a href={`mailto:${company.email}`} className="flex items-center gap-2"><Icon name="mail" className="h-4 w-4" /> {company.email}</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileLink({ to, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `block rounded-xl px-3 py-3 text-base font-semibold ${isActive ? "bg-brand-50 text-brand-700" : "text-slate-800"}`
      }
    >
      {label}
    </NavLink>
  );
}

function MobileAccordion({ label, open, onToggle, children }) {
  return (
    <div className="border-b border-slate-100">
      <button onClick={onToggle} className="flex w-full items-center justify-between px-3 py-3 text-base font-semibold text-slate-800">
        {label}
        <Icon name="chevron" className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-2 pl-1">{children}</div>}
    </div>
  );
}
