import { Link } from "react-router-dom";
import Icon from "./Icon";

const CONTACT_ROLES = new Set(["director-founder", "country-manager"]);

function phoneDigits(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function phoneLabel(phone) {
  const raw = String(phone || "").trim();
  if (!raw) return "";
  if (/\(\s*whatsapp\s*\)/i.test(raw)) return raw;
  return `${raw} (WhatsApp)`;
}

function phoneHref(phone) {
  const digits = phoneDigits(phone);
  if (!digits) return "";
  return `https://wa.me/${digits}`;
}

function ContactRow({ href, icon, children, external = false, empty = false }) {
  const inner = (
    <>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">
        <Icon name={icon} className="h-3.5 w-3.5" />
      </span>
      <span className={`min-w-0 truncate font-medium leading-snug ${empty ? "text-slate-400" : ""}`}>
        {children}
      </span>
    </>
  );

  if (empty || !href) {
    return <div className="flex min-h-[28px] items-center gap-2 text-sm text-slate-400">{inner}</div>;
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="flex min-h-[28px] items-center gap-2 text-sm text-slate-700 transition hover:text-brand-700"
      onClick={(e) => e.stopPropagation()}
    >
      {inner}
    </a>
  );
}

export default function TeamMemberCard({ member, compact = false }) {
  if (!member) return null;
  const initials = String(member.name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

  const isContactRole = CONTACT_ROLES.has(member.roleKey);
  const email = String(member.email || "").trim();
  const phone = String(member.phone || "").trim();
  const wa = phoneHref(phone);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10">
      <Link to={`/team/${member.slug}`} className="block shrink-0">
        <div className={`relative overflow-hidden bg-slate-100 ${compact ? "aspect-[4/3]" : "aspect-[3/4] sm:aspect-[4/5]"}`}>
          {member.imageUrl ? (
            <img
              src={member.imageUrl}
              alt={member.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-900">
              <span className="font-display text-4xl font-extrabold text-white/90">{initials}</span>
            </div>
          )}
        </div>
      </Link>
      <div className="flex min-h-0 flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{member.roleLabel}</p>
        <Link to={`/team/${member.slug}`} className="mt-1">
          <h3 className="font-display text-lg font-bold text-ink group-hover:text-brand-700">{member.name}</h3>
        </Link>

        {/* Fixed ~1.5–2 line bio area so cards stay equal without long text */}
        <p className="mt-2 min-h-[2.6em] line-clamp-2 text-sm leading-snug text-slate-500">
          {member.bio || "\u00a0"}
        </p>

        <div className="flex-1" />

        {isContactRole ? (
          <div className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3">
            <ContactRow href={email ? `mailto:${email}` : ""} icon="mail" empty={!email}>
              {email || "Email not added"}
            </ContactRow>
            <ContactRow href={wa} icon="phone" external empty={!phone}>
              {phone ? phoneLabel(phone) : "Mobile not added"}
            </ContactRow>
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            to={`/team/${member.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition group-hover:translate-x-0.5"
          >
            View profile <Icon name="arrow" className="h-4 w-4" />
          </Link>
          {member.linkedinUrl ? (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-sm shadow-[#0A66C2]/30 transition hover:bg-[#004182] hover:shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon name="linkedin" className="h-4 w-4" />
            </a>
          ) : (
            <span className="inline-flex h-9 w-9" aria-hidden="true" />
          )}
        </div>
      </div>
    </article>
  );
}
