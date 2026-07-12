import Icon from "./Icon";
import Reveal from "./Reveal";
import CounsellingForm from "./CounsellingForm";
import { company } from "../data/site";

export default function CounsellingSection() {
  return (
    <section className="relative overflow-hidden bg-brand-950 py-20">
      <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="container-x relative">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" /> Get Started Today
          </span>
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">Book Your Free Counselling</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Fill out the form and one of our expert advisors will contact you within 24 hours.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="text-white">
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
                  <a key={s.icon} href={s.href} aria-label={s.label} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-brand-500">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
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
  return href ? <a href={href} className="block transition hover:opacity-80">{body}</a> : body;
}
