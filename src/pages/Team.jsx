import { Link } from "react-router-dom";
import CounsellingSection from "../components/CounsellingSection";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SeoHead from "../components/SeoHead";
import TeamMemberCard from "../components/TeamMemberCard";
import { useSite } from "../api/SiteContext";
import { groupTeamByRole } from "../data/site";

export default function Team() {
  const { team } = useSite();
  const groups = groupTeamByRole(team || []);
  const leadership = groups.filter((g) => !g.separate);
  const marketing = groups.find((g) => g.separate);

  return (
    <>
      <SeoHead
        title="Our Team | Education Doorway"
        description="Meet the Education Doorway directors, country managers, managers and marketing team."
        path="/team"
      />
      <PageHero
        eyebrow="Our Team"
        title="The people behind your study-abroad journey"
        subtitle="Experienced advisors and leaders guiding students from counselling to campus."
        crumbs={[{ label: "About Us", to: "/about-us" }, { label: "Our Team" }]}
      />

      <section className="container-x relative z-10 -mt-6 pb-16">
        {!groups.length ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
            Team profiles will appear here soon.
          </p>
        ) : (
          <div className="space-y-14">
            {leadership.map((group) => (
              <TeamGroup key={group.key} group={group} />
            ))}

            {marketing ? (
              <div className="rounded-3xl border border-brand-100 bg-gradient-to-b from-brand-50/80 to-white p-6 sm:p-8">
                <TeamGroup group={marketing} />
              </div>
            ) : null}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/about-us"
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Back to About Us
          </Link>
        </div>
      </section>

      <CounsellingSection />
    </>
  );
}

function TeamGroup({ group }) {
  return (
    <div>
      <Reveal>
        <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">{group.label}</h2>
        <p className="mt-1 text-sm text-slate-500">
          {group.members.length} team member{group.members.length === 1 ? "" : "s"}
        </p>
      </Reveal>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {group.members.map((member, i) => (
          <Reveal key={member.slug} delay={(i % 3) * 70}>
            <TeamMemberCard member={member} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
