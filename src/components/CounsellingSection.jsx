import { useSite } from "../api/SiteContext";
import CounsellingForm from "./CounsellingForm";
import Icon from "./Icon";
import Reveal from "./Reveal";

export default function CounsellingSection() {
  const { company } = useSite();
  return (
    <section className="relative overflow-hidden bg-brand-950 pb-16 pt-14 sm:pb-28 sm:pt-20">
      <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />

      {/* World-map overlay — lower opacity */}
      <img
        src="/overlay-map.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[135%] w-[170%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-center opacity-[0.1]"
      />

      {/* Graduate figure — left side, smaller */}
      <img
        src="/overlay-graduate.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-[1] h-[58%] max-h-[420px] w-auto max-w-[36%] object-contain object-bottom opacity-[0.16] sm:h-[65%] sm:max-h-[480px] sm:max-w-[38%] sm:opacity-[0.2]"
      />

      <div className="container-x relative z-10">
        <div className="mb-8 text-center sm:mb-10">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/95 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" /> Get Started Today
          </span>
          <h2 className="font-display text-2xl font-extrabold text-white sm:text-4xl">Book Your Free Counselling</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
            Fill out the form and one of our expert advisors will contact you within 24 hours.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="relative order-2 text-white lg:order-1">
            <h3 className="font-display text-xl font-bold">Get In Touch</h3>
            <p className="mt-1 text-sm text-slate-300">{company.name}</p>
            <div className="mt-6 space-y-5">
              <ContactRow icon="pin" title="Head Office" text={company.address} />
              <ContactRow icon="phone" title="Phone / WhatsApp" text={company.phone} href={`tel:${company.phone}`} />
              <ContactRow icon="mail" title="Email" text={company.email} href={`mailto:${company.email}`} />
              <ContactRow icon="clock" title="Office Hours" text={company.hours} />
            </div>
            <div className="mt-7">
              <p className="text-sm font-semibold text-white">Follow Us</p>
              <div className="mt-3 flex gap-2.5">
                {company.socials.map((s) => (
                  <a
                    key={s.icon}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-brand-500"
                  >
                    <Icon name={s.icon} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="relative z-10 order-1 rounded-2xl bg-white p-4 shadow-2xl sm:rounded-3xl sm:p-8 lg:order-2">
            <CounsellingForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon, title, text, href }) {
  const body = (
    <div className="flex items-start gap-3.5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-400">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
        <p className="text-sm font-medium text-white">{text}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block transition hover:opacity-80">
      {body}
    </a>
  ) : (
    body
  );
}
