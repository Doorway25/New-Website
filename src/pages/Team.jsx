import { Link } from "react-router-dom";
import CounsellingSection from "../components/CounsellingSection";
import Icon from "../components/Icon";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SeoHead from "../components/SeoHead";
import TeamMemberCard from "../components/TeamMemberCard";
import { useSite } from "../api/SiteContext";
import { groupTeamByRole } from "../data/site";

export default function Team() {
  const { team, getPage } = useSite();
  const seoPage = getPage("team");
  const groups = groupTeamByRole(team || []);
  const director = groups.find((g) => g.key === "director-founder");
  const countryManager = groups.find((g) => g.key === "country-manager");
  const managers = groups.find((g) => g.key === "managers");
  const marketing = groups.find((g) => g.separate);
  const total = (team || []).length;

  return (
    <>
      <SeoHead
        seo={seoPage}
        title="Our Team | Education Doorway"
        description="Meet the Education Doorway directors, country managers, managers and marketing team."
        path="/team"
      />
      <PageHero
        eyebrow={seoPage?.eyebrow || "Our Team"}
        title={seoPage?.title || "People behind your study abroad journey"}
        subtitle={
          seoPage?.subtitle ||
          "Directors, country managers and specialists guiding students from counselling to campus."
        }
        crumbs={[{ label: "About Us", to: "/about-us" }, { label: "Our Team" }]}
      />

      <section className="bg-gradient-to-b from-slate-50 to-white pb-16 pt-10 sm:pt-12">
        <div className="container-x">
          <Reveal className="mb-10 flex flex-col items-start justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">Leadership &amp; team</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                Meet our specialists
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
                {total
                  ? `${total} team member${total === 1 ? "" : "s"} across leadership and marketing.`
                  : "Profiles will appear here once published."}
              </p>
            </div>
            <Link
              to="/about-us"
              className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
            >
              <Icon name="arrow" className="h-4 w-4 rotate-180" /> About Us
            </Link>
          </Reveal>

          {!groups.length ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center text-slate-500">
              Team profiles will appear here soon.
            </p>
          ) : (
            <div className="space-y-12 sm:space-y-14">
              {director || countryManager || managers ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:items-start lg:gap-6">
                  {director ? <TeamGroup group={director} /> : null}
                  {countryManager ? <TeamGroup group={countryManager} /> : null}
                  {managers ? <TeamGroup group={managers} /> : null}
                </div>
              ) : null}

              {marketing ? (
                <div className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm shadow-brand-950/5">
                  <div className="border-b border-brand-50 bg-gradient-to-r from-brand-50 via-white to-gold-50/40 px-6 py-5 sm:px-8">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">Marketing</p>
                    <h3 className="mt-1 font-display text-xl font-extrabold text-ink sm:text-2xl">
                      {marketing.label}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {marketing.members.length} team member
                      {marketing.members.length === 1 ? "" : "s"} · campaigns, content and student outreach
                    </p>
                  </div>
                  <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-3">
                    {marketing.members.map((member, i) => (
                      <Reveal key={member.slug} delay={(i % 3) * 60}>
                        <TeamMemberCard member={member} compact />
                      </Reveal>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>

      <CounsellingSection />
    </>
  );
}

function TeamGroup({ group }) {
  const count = group.members.length;
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-950/5 sm:p-6">
      <Reveal>
        <div className="mb-5 border-b border-slate-100 pb-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">Role</p>
          <h3 className="mt-1 font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            {group.label}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {count} team member{count === 1 ? "" : "s"}
          </p>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 gap-5">
        {group.members.map((member, i) => (
          <Reveal key={member.slug} delay={(i % 3) * 60}>
            <TeamMemberCard member={member} compact />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
