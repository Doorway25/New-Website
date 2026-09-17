import Reveal from "./Reveal";

/** Static department tiles — display only, no detail pages.
 *  Replace images anytime in: public/team-departments/{key}.png
 */
export const TEAM_DEPARTMENTS = [
  {
    key: "marketing",
    label: "Marketing Team",
    image: "/team-departments/marketing.png",
  },
  {
    key: "compliance",
    label: "Compliance Team",
    image: "/team-departments/compliance.png",
  },
  {
    key: "application",
    label: "Application Team",
    image: "/team-departments/application.png",
  },
  {
    key: "counsellor",
    label: "Counsellor Team",
    image: "/team-departments/counsellor.png",
  },
];

export default function MeetOurTeamDepartments({ className = "" }) {
  return (
    <section className={className}>
      <Reveal>
        <div className="rounded-2xl bg-brand-950 px-5 py-4 text-center shadow-lg shadow-brand-950/20 sm:px-8">
          <h2 className="font-display text-lg font-extrabold tracking-[0.08em] text-white sm:text-xl">
            MEET OUR TEAM
          </h2>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {TEAM_DEPARTMENTS.map((dept, i) => (
          <Reveal key={dept.key} delay={i * 70}>
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-200/70 bg-[#2eb0ff] shadow-md shadow-brand-600/20">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#2eb0ff]">
                <img
                  src={dept.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
              <div className="px-3 pb-3 pt-1">
                <div className="rounded-xl bg-brand-950 px-3 py-2.5 text-center">
                  <p className="font-display text-[11px] font-extrabold uppercase tracking-[0.12em] text-white sm:text-xs">
                    {dept.label}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
