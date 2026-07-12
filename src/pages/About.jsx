import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import Counter from "../components/Counter";
import PageHero from "../components/PageHero";
import CounsellingSection from "../components/CounsellingSection";
import { company } from "../data/site";

const advantage = [
  { value: 200, suffix: "+", label: "Universities" },
  { value: 10000, suffix: "+", label: "Success Stories" },
  { value: 11, suffix: "+", label: "Study Countries" },
  { value: 0, suffix: "", label: "Consultation Fees*" },
];

const values = [
  { icon: "shield", title: "Integrity", text: "We give honest advice, even when it's not the easy answer — your trust matters most." },
  { icon: "users", title: "Student Empowerment", text: "We equip students with clarity and confidence to own their study-abroad journey." },
  { icon: "spark", title: "Transparency", text: "No hidden costs or false promises — clear guidance at every single step." },
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Our Agency"
        title="Empowering Your Global Ambitions"
        subtitle="Abroad Study Consultancy is Bangladesh's premier gateway to international education, bridging talented students with world-class universities."
        crumbs={[{ label: "About Us" }]}
      />

      {/* Intro */}
      <section className="container-x grid items-center gap-10 py-16 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-900 p-8 text-white shadow-xl">
              <p className="font-display text-6xl font-extrabold text-gold-400">
                <Counter to={company ? 11 : 11} suffix="+" />
              </p>
              <p className="mt-2 text-lg font-semibold">Years of Excellence</p>
              <p className="mt-4 text-sm text-brand-100">
                Trusted by families across Bangladesh since {company.since} to turn study-abroad dreams into admission letters.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="font-display text-2xl font-extrabold">98%</p>
                  <p className="text-xs text-brand-100">Visa Success Rate</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="font-display text-2xl font-extrabold">1,500+</p>
                  <p className="text-xs text-brand-100">Students Placed</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-600">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" /> Who We Are
          </span>
          <h2 className="font-display text-3xl font-extrabold leading-tight text-ink">
            Founded on integrity &amp; a student-first promise
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            Founded on the principles of integrity and student-first service, Abroad Study has evolved
            into a trusted name for study-abroad aspirants. We don't just process applications; we craft
            futures by providing personalized roadmaps for every student.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Feature icon="users" title="Expert Mentors" text="Certified advisors with global experience." />
            <Feature icon="shield" title="98% Success Rate" text="Proven track record in visa approvals." />
          </div>
        </Reveal>
      </section>

      {/* Mission / Vision / Values */}
      <section className="bg-white py-16">
        <div className="container-x grid gap-5 md:grid-cols-3">
          {[
            { t: "Our Mission", d: "To provide honest, transparent and expert guidance to Bangladeshi students, making international education accessible to all.", i: "compass" },
            { t: "Our Vision", d: "To be the most reliable global education partner, recognized for our commitment to excellence and student success.", i: "target" },
            { t: "Our Values", d: "Integrity, Student Empowerment and Transparency drive every consultation and application we handle.", i: "spark" },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 90}>
              <div className="h-full rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-7 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Icon name={c.i} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-ink">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Advantage stats */}
      <section className="container-x py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold text-ink">The Abroad Study Advantage</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {advantage.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
                <Counter to={s.value} suffix={s.suffix} className="font-display text-3xl font-extrabold text-brand-600 sm:text-4xl" />
                <p className="mt-1 text-sm font-medium text-slate-500">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-slate-400">*Terms &amp; Conditions applied.</p>
      </section>

      {/* Values detail */}
      <section className="bg-white py-16">
        <div className="container-x grid gap-5 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="flex h-full gap-4 rounded-2xl border border-slate-100 p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name={v.icon} className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="font-display text-lg font-bold text-ink">{v.title}</h4>
                  <p className="mt-1 text-sm text-slate-500">{v.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="container-x mt-10 text-center">
          <Link to="/apply-now" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:brightness-110">
            Start Your Journey <Icon name="arrow" className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <CounsellingSection />
    </>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-bold text-ink">{title}</p>
        <p className="text-xs text-slate-500">{text}</p>
      </div>
    </div>
  );
}
