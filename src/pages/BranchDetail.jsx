import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import Flag from "../components/Flag";
import Reveal from "../components/Reveal";
import PageHero from "../components/PageHero";
import SeoHead from "../components/SeoHead";
import { useSite } from "../api/SiteContext";
import { postLead } from "../api/client";

function useCaptcha() {
  return useMemo(() => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const ops = [
      { sym: "+", fn: (x, y) => x + y },
      { sym: "-", fn: (x, y) => x - y },
    ];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const [x, y] = op.sym === "-" && b > a ? [b, a] : [a, b];
    return { q: `${x} ${op.sym} ${y}`, answer: op.fn(x, y) };
  }, []);
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

function BranchEnquiryForm({ branch }) {
  const cap = useCaptcha();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ website: "", name: "", email: "", phone: "", answer: "", message: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Please enter your full name.");
    if (!form.email.trim() && !form.phone.trim())
      return setError("Please provide at least your email or phone number.");
    if (Number(form.answer) !== cap.answer)
      return setError("The security check answer is incorrect.");
    if (form.website) return setSent(true);
    setBusy(true);
    try {
      await postLead({
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        message: form.message.trim() || null,
        type: "branch",
        meta: { branchSlug: branch.slug, branchCity: branch.city, branchCountry: branch.country },
      });
      setSent(true);
    } catch (err) {
      setError(err.message || "Could not submit. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Icon name="check" className="h-7 w-7" />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-ink">Thank you, {form.name.split(" ")[0]}!</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-600">
          Your enquiry has been received. The {branch.city} team will contact you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} className="hidden" aria-hidden="true" />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Full Name <span className="text-rose-500">*</span></span>
        <input value={form.name} onChange={set("name")} placeholder="e.g. Ayesha Rahman" className={inputCls} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
          <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Phone Number</span>
          <input value={form.phone} onChange={set("phone")} placeholder="+8801XXXXXXXXX" className={inputCls} />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Message</span>
        <textarea rows={3} value={form.message} onChange={set("message")} placeholder="Tell us about your study plans…" className={inputCls} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Security Check: What is {cap.q}? <span className="text-rose-500">*</span></span>
        <input value={form.answer} onChange={set("answer")} inputMode="numeric" placeholder="Your answer" className={inputCls} />
      </label>
      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:brightness-110 disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send Enquiry"}
        <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}

export default function BranchDetail() {
  const { slug } = useParams();
  const { branches, branchBySlug, company } = useSite();
  const branch = branchBySlug[slug];

  if (!branch) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Branch not found</h1>
        <p className="mt-3 text-slate-500">The branch you're looking for doesn't exist.</p>
        <Link to="/contact-us" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          Back to Contact
        </Link>
      </div>
    );
  }

  const others = branches.filter(
    (b) => b.slug !== branch.slug && b.country === branch.country
  );

  const WHATSAPP_NUMBER = "+44 7939 983 493";

  const info = [
    { icon: "pin", title: "Address", text: branch.address },
    { icon: "phone", title: "Phone / WhatsApp", text: branch.phone, href: `tel:${branch.phone}`, extra: `${WHATSAPP_NUMBER} (WhatsApp)`, extraHref: `tel:+447939983493` },
    { icon: "mail", title: "Email", text: branch.email, href: `mailto:${branch.email}` },
    { icon: "clock", title: "Office Hours", text: branch.hours },
  ];

  return (
    <>
      <SeoHead
        seo={branch}
        title={`${branch.city} Office | Education Doorway`}
        description={branch.blurb}
        path={`/branch/${branch.slug}`}
      />
      <PageHero
        eyebrow={`${branch.country} Branch`}
        title={`${branch.city} Office`}
        subtitle={branch.blurb}
        crumbs={[{ label: "Contact Us", to: "/contact-us" }, { label: branch.city }]}
      />

      <section className="container-x -mt-8 relative z-10 pb-4">
        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
          <div className="relative aspect-[21/9] min-h-[180px] sm:min-h-[240px]">
            <img
              src={branch.image}
              alt={`${branch.city} branch`}
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/20 to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center gap-3 sm:bottom-6 sm:left-6">
              <Flag code={branch.code} className="h-10 w-10 ring-2 ring-white/70 sm:h-12 sm:w-12" title={branch.country} />
              <div className="text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-200">{branch.country}</p>
                <p className="font-display text-xl font-bold sm:text-2xl">{branch.city} Office</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-brand-950/5 sm:p-8">
            <div className="flex items-center gap-3">
              <Flag code={branch.code} className="h-12 w-12" title={branch.country} />
              <div>
                <h2 className="font-display text-2xl font-extrabold text-ink">{branch.city}</h2>
                <p className="text-sm text-slate-400">{branch.country}</p>
              </div>
              {branch.head && (
                <span className="ml-auto rounded-full bg-gold-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gold-600">
                  Head Office
                </span>
              )}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-600 sm:text-base">{branch.blurb}</p>

            <div className="mt-6 space-y-4">
              {info.map((row) => {
                const body = (
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon name={row.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">{row.title}</p>
                      <p className="text-sm font-medium text-ink">{row.text}</p>
                      {row.extra && (
                        <a href={row.extraHref} className="text-sm font-medium text-brand-600 hover:underline">{row.extra}</a>
                      )}
                    </div>
                  </div>
                );
                return (
                  <div key={row.title}>
                    {row.href ? <a href={row.href} className="block transition hover:opacity-80">{body}</a> : body}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={company.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600">
                <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp
              </a>
              <a href={`tel:${branch.phone}`} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                <Icon name="phone" className="h-4 w-4" /> Call Branch
              </a>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
              <iframe
                title={`${branch.city} location`}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(branch.mapQuery)}&output=embed`}
              />
            </div>
          </Reveal>

          <Reveal delay={120} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-brand-950/5 sm:p-8">
            <h3 className="font-display text-xl font-bold text-ink">Enquire at {branch.city}</h3>
            <p className="mt-1.5 text-sm text-slate-500">
              Send your details and the {branch.city} team will get back to you within 24 hours.
            </p>
            <div className="mt-6">
              <BranchEnquiryForm branch={branch} />
            </div>
          </Reveal>
        </div>
      </section>

      {branch.details?.length > 0 && (
        <section className="container-x pb-4 pt-8 sm:pt-10">
          <Reveal className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-brand-950/5 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Branch details</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-ink">What this branch offers</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Services available at our {branch.city} office for students planning to study abroad.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {branch.details.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-700"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      )}

      {others.length > 0 && (
        <section className="container-x py-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Same country</p>
              <h2 className="font-display text-2xl font-bold text-ink">Other branches in {branch.country}</h2>
            </div>
            <Link to={`/contact-us?country=${encodeURIComponent(
              /bangladesh/i.test(branch.country) ? "bangladesh"
                : /pakistan/i.test(branch.country) ? "pakistan"
                : /nigeria/i.test(branch.country) ? "nigeria"
                : "uk"
            )}`} className="text-sm font-semibold text-brand-600 hover:underline">
              View all on Contact →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((b, i) => (
              <Reveal key={b.slug} delay={(i % 3) * 70}>
                <Link
                  to={`/branch/${b.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10"
                >
                  {b.image && (
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                      <img
                        src={b.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-center gap-2.5">
                      <Flag code={b.code} className="h-8 w-8" title={b.country} />
                      <span>
                        <span className="block font-display text-lg font-bold text-ink group-hover:text-brand-700">{b.city}</span>
                        <span className="block text-xs text-slate-400">{b.country}</span>
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-slate-500">{b.blurb}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 border-t border-slate-100 pt-4 text-sm font-semibold text-brand-600 transition-transform group-hover:translate-x-0.5">
                      View branch <Icon name="arrow" className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
