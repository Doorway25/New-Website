import { Link, useParams } from "react-router-dom";
import CounsellingSection from "../components/CounsellingSection";
import Icon from "../components/Icon";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SeoHead from "../components/SeoHead";
import TeamMemberCard from "../components/TeamMemberCard";
import { useSite } from "../api/SiteContext";

export default function TeamDetail() {
  const { slug } = useParams();
  const { team, teamBySlug } = useSite();
  const member = teamBySlug?.[slug];

  if (!member) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Team member not found</h1>
        <p className="mt-3 text-slate-500">This profile may have been moved or is not published yet.</p>
        <Link
          to="/team"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          View Our Team
        </Link>
      </div>
    );
  }

  const initials = String(member.name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

  const others = (team || []).filter((m) => m.slug !== member.slug).slice(0, 3);

  return (
    <>
      <SeoHead
        title={`${member.name} | Our Team | Education Doorway`}
        description={member.bio || `${member.name} — ${member.roleLabel} at Education Doorway.`}
        path={`/team/${member.slug}`}
        image={member.imageUrl}
      />
      <PageHero
        eyebrow="Our Team"
        title={member.name}
        subtitle={member.roleLabel}
        crumbs={[
          { label: "About Us", to: "/about-us" },
          { label: "Our Team", to: "/team" },
          { label: member.name },
        ]}
      />

      <section className="container-x relative z-10 -mt-8 pb-14">
        <Reveal className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-brand-950/5">
          <div className="grid lg:grid-cols-[280px_1fr]">
            <div className="relative min-h-[280px] bg-slate-100 lg:min-h-full">
              {member.imageUrl ? (
                <img src={member.imageUrl} alt={member.name} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-900">
                  <span className="font-display text-5xl font-extrabold text-white/90">{initials}</span>
                </div>
              )}
            </div>
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{member.roleLabel}</p>
              <h1 className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl">{member.name}</h1>
              {member.bio ? (
                <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-slate-600">{member.bio}</p>
              ) : null}

              {(member.email || member.phone) &&
              (member.roleKey === "director-founder" || member.roleKey === "country-manager") ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {member.email ? (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-brand-200 hover:text-brand-700"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">
                        <Icon name="mail" className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 truncate">{member.email}</span>
                    </a>
                  ) : null}
                  {member.phone ? (
                    <a
                      href={`https://wa.me/${String(member.phone).replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-brand-200 hover:text-brand-700"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">
                        <Icon name="phone" className="h-4 w-4" />
                      </span>
                      <span>
                        {/\(\s*whatsapp\s*\)/i.test(member.phone)
                          ? member.phone
                          : `${member.phone} (WhatsApp)`}
                      </span>
                    </a>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                {member.linkedinUrl ? (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    <Icon name="linkedin" className="h-4 w-4" /> LinkedIn profile
                  </a>
                ) : null}
                <Link
                  to="/team"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
                >
                  All team members
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {others.length ? (
        <section className="container-x pb-16">
          <h2 className="font-display text-2xl font-bold text-ink">More from Our Team</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((m, i) => (
              <Reveal key={m.slug} delay={(i % 3) * 70}>
                <TeamMemberCard member={m} compact />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <CounsellingSection />
    </>
  );
}
