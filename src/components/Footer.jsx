import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Icon from "./Icon";
import Logo from "./Logo";
import { useSite } from "../api/SiteContext";

gsap.registerPlugin(ScrollTrigger);

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about-us" },
  { label: "Study in UK", to: "/study-in-uk" },
  { label: "Course Finder", to: "/courses" },
  { label: "Contact Us", to: "/contact-us" },
  { label: "Apply Now", to: "/apply-now" },
];

const pages = [
  { label: "Articles", to: "/articles" },
  { label: "Events", to: "/events" },
  { label: "Video Stories", to: "/stories" },
  { label: "Destinations", to: "/countries" },
  { label: "Study in UK", to: "/study-in-uk" },
  { label: "Book Appointment", to: "/apply-now" },
];

const legal = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
  { label: "Cookie Policy", to: "/cookie-policy" },
];

export default function Footer() {
  const { company } = useSite();
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cols = "[data-footer-col]";
      const social = "[data-footer-social] a";
      const bottom = "[data-footer-bottom]";

      gsap.set(cols, { autoAlpha: 0, y: 32 });
      gsap.set(social, { autoAlpha: 0, scale: 0.7 });
      gsap.set(bottom, { autoAlpha: 0, y: 16 });

      gsap.to(cols, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      gsap.to(social, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.45,
        stagger: 0.08,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      gsap.to(bottom, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.25,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative mt-8 overflow-hidden bg-brand-950 text-slate-300 sm:mt-10">
      {/* World-map overlay — full-wide, centered */}
      <img
        src="/overlay-map.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[180%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-center opacity-[0.12]"
      />
      {/* Graduate figure — footer only */}
      <img
        src="/overlay-graduate.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 z-[1] h-[58%] max-h-[420px] w-auto max-w-[36%] object-contain object-bottom opacity-[0.18] sm:opacity-[0.22]"
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-brand-950/80 via-transparent to-brand-950/40" />

      <div className="container-x relative z-10 grid gap-10 py-8 md:grid-cols-2 md:py-10 lg:grid-cols-5">
        <div data-footer-col className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            {company.name} is a well-known, trusted education consultancy helping students
            achieve their dream of studying abroad since {company.since}.
          </p>
          <div data-footer-social className="mt-5 flex gap-2.5">
            {company.socials.map((s) => (
              <a
                key={s.icon}
                href={s.href}
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition hover:bg-brand-500 hover:text-white"
              >
                <Icon name={s.icon} className="h-4.5 w-4.5" />
              </a>
            ))}
          </div>
        </div>

        <div data-footer-col>
          <FooterCol title="Quick Links">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="hover:text-white">{l.label}</Link>
              </li>
            ))}
          </FooterCol>
        </div>

        <div data-footer-col>
          <FooterCol title="Pages">
            {pages.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="hover:text-white">{l.label}</Link>
              </li>
            ))}
          </FooterCol>
        </div>

        <div data-footer-col>
          <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">Contact</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex gap-2.5"><Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> {company.address}</li>
            <li><a href={`tel:${company.phone}`} className="flex gap-2.5 hover:text-white"><Icon name="phone" className="h-4 w-4 shrink-0 text-brand-400" /> {company.phone}</a></li>
            <li><a href={`mailto:${company.email}`} className="flex gap-2.5 hover:text-white"><Icon name="mail" className="h-4 w-4 shrink-0 text-brand-400" /> {company.email}</a></li>
            <li>
              <a href={company.whatsapp} className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1.5 text-emerald-300 hover:bg-emerald-500/25">
                <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div data-footer-bottom className="relative z-10 border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-slate-400 md:flex-row">
          <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {legal.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-white">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }) {
  return (
    <div>
      <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">{title}</h4>
      <ul className="space-y-2.5 text-sm text-slate-400">{children}</ul>
    </div>
  );
}
