import Reveal from "./Reveal";
import Icon from "./Icon";

/** Static department tiles — display only, no detail pages. */
export const TEAM_DEPARTMENTS = [
  {
    key: "marketing",
    label: "Marketing Team",
    icon: "spark",
    blurb: "Brand, campaigns and student outreach",
  },
  {
    key: "compliance",
    label: "Compliance Team",
    icon: "shield",
    blurb: "Quality checks and regulatory standards",
  },
  {
    key: "application",
    label: "Application Team",
    icon: "doc",
    blurb: "Applications, documents and offers",
  },
  {
    key: "counsellor",
    label: "Counsellor Team",
    icon: "users",
    blurb: "Personal guidance for every student",
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
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-200/60 bg-gradient-to-b from-[#3eb6ff] to-[#1a8fd9] shadow-md shadow-brand-600/20">
              <div className="relative flex flex-1 flex-col items-center justify-center px-4 pb-3 pt-8">
                <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,white_1.5px,transparent_1.5px)] [background-size:18px_18px]" />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white shadow-inner backdrop-blur-sm">
                  <Icon name={dept.icon} className="h-8 w-8" />
                </span>
                <p className="relative mt-4 text-center text-xs font-medium leading-snug text-white/90">
                  {dept.blurb}
                </p>
              </div>
              <div className="relative px-3 pb-3">
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
