import { Link } from "react-router-dom";
import Icon from "./Icon";
import Logo from "./Logo";
import { company } from "../data/site";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about-us" },
  { label: "Countries", to: "/countries" },
  { label: "Courses", to: "/courses" },
  { label: "Contact Us", to: "/contact-us" },
  { label: "Apply Now", to: "/apply-now" },
];

const pages = [
  { label: "Articles", to: "/articles" },
  { label: "Events", to: "/events" },
  { label: "Study Destinations", to: "/countries" },
  { label: "Programmes", to: "/study" },
  { label: "Book Appointment", to: "/apply-now" },
];

const legal = ["Privacy Policy", "Terms & Conditions", "Cookie Policy"];

export default function Footer() {
  return (
    <footer className="mt-20 bg-brand-950 text-slate-300">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            {company.name} is a well-known, trusted education consultancy helping students
            achieve their dream of studying abroad since {company.since}.
          </p>
          <div className="mt-5 flex gap-2.5">
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

        <FooterCol title="Quick Links">
          {quickLinks.map((l) => (
            <li key={l.label}>
              <Link to={l.to} className="hover:text-white">{l.label}</Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Pages">
          {pages.map((l) => (
            <li key={l.label}>
              <Link to={l.to} className="hover:text-white">{l.label}</Link>
            </li>
          ))}
        </FooterCol>

        <div>
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

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-slate-400 md:flex-row">
          <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {legal.map((l) => (
              <a key={l} href="#" className="hover:text-white">{l}</a>
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
