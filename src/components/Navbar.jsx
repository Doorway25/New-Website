import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Icon from "./Icon";
import Flag from "./Flag";
import Logo from "./Logo";
import { useSite } from "../api/SiteContext";

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
  const { company, programs, subjects } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState(null);
  const location = useLocation();

  const contactRegions = [
    { key: "uk", label: "United Kingdom", short: "UK", code: "gb", to: "/contact-us" },
    { key: "bangladesh", label: "Bangladesh", short: "Bangladesh", code: "bd", to: "/contact-us?country=bangladesh" },
    { key: "pakistan", label: "Pakistan", short: "Pakistan", code: "pk", to: "/contact-us?country=pakistan" },
    { key: "nigeria", label: "Nigeria", short: "Nigeria", code: "ng", to: "/contact-us?country=nigeria" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSub(null);
  }, [location.pathname, location.search]);

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
        <div className="container-x flex h-16 items-center justify-between gap-3 sm:h-[72px] sm:gap-4">
          <Logo />

          <ul className="hidden items-center lg:flex">
            <li>
              <NavLink to="/" end className={navLink}>Home</NavLink>
            </li>

            <li>
              <NavLink to="/study-in-uk" className={navLink}>Study in UK</NavLink>
            </li>

            <Dropdown label="Course Finder" wide>
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

            <li><NavLink to="/events" className={navLink}>Events</NavLink></li>
            <li><NavLink to="/about-us" className={navLink}>About Us</NavLink></li>

            <Dropdown label="Contact Us" wide>
              <div className="grid grid-cols-[1fr_1.15fr] gap-4">
                <div>
                  <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Get in touch</p>
                  <div className="grid gap-1">
                    <Link to="/contact-us" className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700">
                      <Icon name="pin" className="h-4 w-4 text-brand-500" /> Contact page
                    </Link>
                    <a href={`tel:${company.phone}`} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700">
                      <Icon name="phone" className="h-4 w-4 text-brand-500" /> {company.phone}
                    </a>
                    <a href={company.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700">
                      <Icon name="whatsapp" className="h-4 w-4 text-emerald-500" /> WhatsApp
                    </a>
                    <a href={`mailto:${company.email}`} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700">
                      <Icon name="mail" className="h-4 w-4 text-brand-500" /> {company.email}
                    </a>
                    <Link to="/apply-now" className="mt-1 block rounded-lg bg-brand-50 px-3 py-2 text-center text-sm font-semibold text-brand-700 hover:bg-brand-100">
                      Book free counselling
                    </Link>
                  </div>
                </div>
                <div>
                  <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Our branches</p>
                  <div className="grid gap-1">
                    {contactRegions.map((r) => (
                      <Link
                        key={r.key}
                        to={r.to}
                        className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                      >
                        <Flag code={r.code} className="h-7 w-7" title={r.label} />
                        {r.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Dropdown>
          </ul>

          <div className="flex items-center gap-2">
            <Link
              to="/apply-now"
              className="inline-flex rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-brand-500/25 transition hover:brightness-110 sm:px-5 sm:py-2.5 sm:text-sm sm:shadow-lg"
            >
              Apply Now
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 sm:h-11 sm:w-11 lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <Icon name={open ? "close" : "menu"} className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col bg-white shadow-2xl safe-pb">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200"
                aria-label="Close"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
              <MobileLink to="/" label="Home" />
              <MobileLink to="/study-in-uk" label="Study in UK" />
              <MobileAccordion label="Course Finder" open={sub === "p"} onToggle={() => setSub(sub === "p" ? null : "p")}>
                <div className="grid gap-0.5">
                  {programs.map((p) => (
                    <Link
                      key={p.key}
                      to={`/study/all/${p.key}/all`}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-brand-50"
                    >
                      <span>{p.name}</span>
                      <span className="text-xs text-slate-400">{p.count}</span>
                    </Link>
                  ))}
                  <Link to="/courses" className="rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-600 hover:bg-brand-50">
                    All courses →
                  </Link>
                </div>
              </MobileAccordion>
              <MobileLink to="/events" label="Events" />
              <MobileLink to="/about-us" label="About Us" />
              <MobileAccordion label="Contact Us" open={sub === "c"} onToggle={() => setSub(sub === "c" ? null : "c")}>
                <Link
                  to="/contact-us"
                  className="mb-3 flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2.5 text-sm font-semibold text-brand-700"
                >
                  <Icon name="pin" className="h-4 w-4" /> Contact page
                </Link>
                <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Branches</p>
                <div className="grid grid-cols-2 gap-2">
                  {contactRegions.map((r) => (
                    <Link
                      key={r.key}
                      to={r.to}
                      className="flex flex-col items-start gap-2 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition active:scale-[0.98] hover:border-brand-200 hover:shadow-md"
                    >
                      <Flag code={r.code} className="h-9 w-9" title={r.label} />
                      <span className="font-display text-sm font-bold leading-tight text-ink">{r.short}</span>
                    </Link>
                  ))}
                </div>
              </MobileAccordion>
            </div>

            <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-4">
              <Link
                to="/apply-now"
                className="block rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-brand-500/25"
              >
                Apply Now
              </Link>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <a
                  href={`tel:${company.phone}`}
                  className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-[11px] font-semibold text-slate-600"
                >
                  <Icon name="phone" className="h-4 w-4 text-brand-500" /> Call
                </a>
                <a
                  href={company.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-[11px] font-semibold text-slate-600"
                >
                  <Icon name="whatsapp" className="h-4 w-4 text-emerald-500" /> WhatsApp
                </a>
                <a
                  href={`mailto:${company.email}`}
                  className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-[11px] font-semibold text-slate-600"
                >
                  <Icon name="mail" className="h-4 w-4 text-brand-500" /> Email
                </a>
              </div>
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
        `block rounded-xl px-3 py-3 text-[15px] font-semibold ${isActive ? "bg-brand-50 text-brand-700" : "text-slate-800"}`
      }
    >
      {label}
    </NavLink>
  );
}

function MobileAccordion({ label, open, onToggle, children }) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-3 text-[15px] font-semibold text-slate-800"
        aria-expanded={open}
      >
        {label}
        <Icon name="chevron" className={`h-5 w-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}
