import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import PageHero from "../components/PageHero";
import CounsellingSection from "../components/CounsellingSection";
import { company } from "../data/site";

const cards = [
  { icon: "phone", title: "Call Us", lines: [company.phone, company.phoneAlt], href: `tel:${company.phone}` },
  { icon: "whatsapp", title: "WhatsApp", lines: ["Chat with an Expert"], href: company.whatsapp, accent: "emerald" },
  { icon: "mail", title: "Email Us", lines: [company.email], href: `mailto:${company.email}` },
  { icon: "pin", title: "Our Office", lines: [company.address, company.hours] },
];

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Find Us & Reach Out"
        subtitle="Trusted path to study abroad — our advisors are ready to answer your questions."
        crumbs={[{ label: "Contact Us" }]}
      />

      <section className="container-x -mt-8 relative z-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => {
            const Wrapper = c.href ? "a" : "div";
            const emerald = c.accent === "emerald";
            return (
              <Reveal key={c.title} delay={i * 70}>
                <Wrapper
                  {...(c.href ? { href: c.href, target: c.href.startsWith("http") ? "_blank" : undefined, rel: "noreferrer" } : {})}
                  className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10"
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${emerald ? "bg-emerald-100 text-emerald-600" : "bg-brand-50 text-brand-600"}`}>
                    <Icon name={c.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink">{c.title}</h3>
                  <div className="mt-1.5 space-y-0.5">
                    {c.lines.map((l) => <p key={l} className="text-sm text-slate-500">{l}</p>)}
                  </div>
                </Wrapper>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Map */}
      <section className="container-x py-14">
        <Reveal className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
          <iframe
            title="Office location"
            className="h-[420px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Banani+Dhaka+Bangladesh&output=embed"
          />
        </Reveal>
      </section>

      <CounsellingSection />
    </>
  );
}
