import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Icon from "../components/Icon";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { useSite } from "../api/SiteContext";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

const years = Array.from({ length: 12 }, (_, i) => String(new Date().getFullYear() + 1 - i));

function resolvePrefill(params, { universityBySlug, universities, countryBySlug, countries }) {
  const uniParam = params.get("university") || "";
  const intakeParam = params.get("intake") || "";
  const countryParam = params.get("country") || "";

  const uni =
    universityBySlug[uniParam] ||
    universities.find((u) => u.name.toLowerCase() === uniParam.toLowerCase()) ||
    null;

  const country =
    (uni && countryBySlug[uni.country]) ||
    countryBySlug[countryParam] ||
    countries.find((c) => c.name.toLowerCase() === countryParam.toLowerCase()) ||
    null;

  const intakeOptions = uni?.intakes || [];
  const intake =
    (intakeParam && intakeOptions.includes(intakeParam) && intakeParam) ||
    uni?.upcoming?.[0] ||
    intakeOptions[0] ||
    intakeParam ||
    "";

  return {
    university: uni?.name || "",
    country: country?.name || "",
    intake,
    intakeOptions,
  };
}

export default function Apply() {
  const [searchParams] = useSearchParams();
  const { countries, countryBySlug, programs, subjects, universities, universityBySlug } = useSite();
  const prefill = useMemo(
    () => resolvePrefill(searchParams, { universityBySlug, universities, countryBySlug, countries }),
    [searchParams, universityBySlug, universities, countryBySlug, countries]
  );

  const cap = useMemo(() => {
    const a = Math.floor(Math.random() * 9) + 3;
    const b = Math.floor(Math.random() * 3) + 1;
    return { q: `${a} - ${b}`, answer: a - b };
  }, []);

  const [form, setForm] = useState({
    website: "", name: "", email: "", phone: "", nationality: "Bangladeshi",
    qualification: "", passingYear: "", englishTest: "", program: "",
    course: "", university: prefill.university, country: prefill.country,
    intake: prefill.intake, answer: "", agree: false,
  });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!prefill.university && !prefill.intake && !prefill.country) return;
    setForm((f) => ({
      ...f,
      university: prefill.university || f.university,
      country: prefill.country || f.country,
      intake: prefill.intake || f.intake,
    }));
  }, [prefill.university, prefill.intake, prefill.country]);

  const selectedUni = universities.find((u) => u.name === form.university);
  const intakeOptions = selectedUni?.intakes?.length
    ? selectedUni.intakes
    : prefill.intakeOptions.length
      ? prefill.intakeOptions
      : Array.from(new Set(universities.flatMap((u) => u.intakes || [])));

  const set = (k) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => {
      if (k === "university") {
        const next = universities.find((u) => u.name === value);
        const country = next ? countryBySlug[next.country] : null;
        const nextIntake =
          (f.intake && next?.intakes?.includes(f.intake) && f.intake) ||
          next?.upcoming?.[0] ||
          next?.intakes?.[0] ||
          "";
        return {
          ...f,
          university: value,
          country: country?.name || f.country,
          intake: nextIntake,
        };
      }
      return { ...f, [k]: value };
    });
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Please enter your full name.");
    if (!form.email.trim() && !form.phone.trim()) return setError("Please provide at least an email address or phone number.");
    if (Number(form.answer) !== cap.answer) return setError("The security answer is incorrect.");
    if (!form.agree) return setError("Please agree to the privacy policy and terms of service.");
    setSent(true);
  };

  return (
    <>
      <PageHero
        eyebrow="Apply Now"
        title="Start Your International Journey"
        subtitle="Complete the application below and our advisors will build a personalized roadmap for you."
        crumbs={[{ label: "Apply Now" }]}
      />

      <section className="container-x -mt-8 relative z-10 pb-4">
        {sent ? (
          <Reveal className="mx-auto max-w-2xl rounded-3xl border border-emerald-100 bg-white p-10 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Icon name="check" className="h-8 w-8" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-extrabold text-ink">Application Received!</h2>
            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Thank you, {form.name.split(" ")[0]}. Our team will review your profile and reach out within 24 hours
              with the next steps for your study-abroad journey.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/study" className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">Browse Universities</Link>
              <Link to="/" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Back to Home</Link>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            <Reveal className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-brand-950/5 sm:p-8">
              <form onSubmit={submit} className="space-y-8">
                <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} className="hidden" aria-hidden="true" />

                <FormSection number="1" title="Personal Information">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full Name"><input value={form.name} onChange={set("name")} placeholder="Your full name" className={inputCls} /></Field>
                    <Field label="Email Address"><input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" className={inputCls} /></Field>
                    <Field label="Phone Number"><input value={form.phone} onChange={set("phone")} placeholder="+8801XXXXXXXXX" className={inputCls} /></Field>
                    <Field label="Nationality"><input value={form.nationality} onChange={set("nationality")} className={inputCls} /></Field>
                  </div>
                  <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">
                    Please provide at least an email address or phone number — we need one to contact you.
                  </p>
                </FormSection>

                <FormSection number="2" title="Academic Profile">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Last Qualification"><input value={form.qualification} onChange={set("qualification")} placeholder="e.g. HSC / A-Level" className={inputCls} /></Field>
                    <Field label="Passing Year">
                      <Sel value={form.passingYear} onChange={set("passingYear")} placeholder="Select year" options={years} />
                    </Field>
                    <Field label="English Test">
                      <Sel value={form.englishTest} onChange={set("englishTest")} placeholder="Select test" options={["IELTS", "TOEFL", "PTE", "Duolingo", "MOI", "Not taken yet"]} />
                    </Field>
                  </div>
                </FormSection>

                <FormSection number="3" title="Preferences">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Preferred Program">
                      <Sel value={form.program} onChange={set("program")} placeholder="Select program" options={programs.map((p) => p.name)} />
                    </Field>
                    <Field label="Preferred Course">
                      <Sel value={form.course} onChange={set("course")} placeholder="Select course" options={subjects} />
                    </Field>
                    <Field label="Preferred University">
                      <Sel value={form.university} onChange={set("university")} placeholder="Select university" options={universities.map((u) => u.name)} />
                    </Field>
                    <Field label="Preferred Intake">
                      <Sel value={form.intake} onChange={set("intake")} placeholder="Select intake" options={intakeOptions} />
                    </Field>
                    <Field label="Preferred Country">
                      <Sel value={form.country} onChange={set("country")} placeholder="Select country" options={countries.map((c) => c.name)} />
                    </Field>
                  </div>
                </FormSection>

                <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
                  <Field label={`Security Question: What is ${cap.q}?`} required>
                    <input value={form.answer} onChange={set("answer")} inputMode="numeric" placeholder="Your answer" className={`${inputCls} max-w-xs`} />
                  </Field>
                  <label className="flex items-start gap-3 text-sm text-slate-600">
                    <input type="checkbox" checked={form.agree} onChange={set("agree")} className="mt-0.5 h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                    <span>I agree to the <Link to="/privacy-policy" className="font-semibold text-brand-600 hover:underline">privacy policy</Link> and <Link to="/terms-and-conditions" className="font-semibold text-brand-600 hover:underline">terms of service</Link>.</span>
                  </label>
                </div>

                {error && <p className="rounded-lg bg-rose-50 px-3 py-2.5 text-sm text-rose-600">{error}</p>}

                <button type="submit" className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-4 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:brightness-110">
                  Submit Application <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            </Reveal>

            <div className="space-y-5">
              <Reveal delay={80} className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-900 p-7 text-white shadow-lg">
                <h3 className="font-display text-xl font-bold">Why apply with us?</h3>
                <ul className="mt-5 space-y-4">
                  {[
                    { t: "98% Visa Success", d: "Backed by expert documentation." },
                    { t: "Zero Consultation Fees", d: "Free, no-obligation guidance." },
                    { t: "200+ Universities", d: "Across 11+ global destinations." },
                    { t: "24/7 Dedicated Support", d: "We're with you at every step." },
                  ].map((f) => (
                    <li key={f.t} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15"><Icon name="check" className="h-4 w-4 text-gold-400" /></span>
                      <div>
                        <p className="text-sm font-semibold">{f.t}</p>
                        <p className="text-xs text-brand-100">{f.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={140} className="rounded-3xl border border-slate-100 bg-white p-7 text-center shadow-sm">
                <div className="flex justify-center text-gold-500">
                  {Array.from({ length: 5 }).map((_, i) => <Icon key={i} name="star" className="h-5 w-5 fill-current" stroke={0} />)}
                </div>
                <p className="mt-3 text-sm italic text-slate-600">"They made my UK dream come true — from application to visa, flawless service!"</p>
                <p className="mt-3 text-sm font-bold text-ink">Rashida Akter</p>
                <p className="text-xs text-slate-500">University of Manchester, UK</p>
              </Reveal>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function FormSection({ number, title, children }) {
  return (
    <div>
      <h3 className="mb-4 flex items-center gap-3 font-display text-lg font-bold text-ink">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">{number}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label} {required && <span className="text-rose-500">*</span>}</span>
      {children}
    </label>
  );
}

function Sel({ value, onChange, placeholder, options }) {
  return (
    <div className="relative">
      <select value={value} onChange={onChange} className={`${inputCls} appearance-none pr-10 ${value ? "" : "text-slate-400"}`}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o} className="text-ink">{o}</option>)}
      </select>
      <Icon name="chevron" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
