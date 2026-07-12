import { useMemo, useState } from "react";
import Icon from "./Icon";

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

export default function CounsellingForm({ compact = false }) {
  const [captcha, setCaptcha] = useState(0);
  const cap = useCaptcha();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ website: "", name: "", email: "", phone: "", answer: "", message: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Please enter your full name.");
    if (!form.email.trim() && !form.phone.trim())
      return setError("Please provide at least your email or phone number.");
    if (Number(form.answer) !== cap.answer)
      return setError("The security check answer is incorrect.");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Icon name="check" className="h-7 w-7" />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-ink">Thank you, {form.name.split(" ")[0]}!</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-600">
          Your request has been received. One of our expert advisors will contact you within 24 hours.
        </p>
        <button
          onClick={() => { setSent(false); setForm({ website: "", name: "", email: "", phone: "", answer: "", message: "" }); }}
          className="mt-5 text-sm font-semibold text-brand-600 hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Honeypot */}
      <input
        type="text" tabIndex={-1} autoComplete="off" value={form.website}
        onChange={set("website")} className="hidden" aria-hidden="true"
      />
      <Field label="Full Name" required>
        <input value={form.name} onChange={set("name")} placeholder="e.g. Ayesha Rahman" className={inputCls} />
      </Field>
      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <Field label="Email">
          <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" className={inputCls} />
        </Field>
        <Field label="Phone Number">
          <input value={form.phone} onChange={set("phone")} placeholder="+8801XXXXXXXXX" className={inputCls} />
        </Field>
      </div>
      <p className="rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">
        Please provide at least your <strong>email</strong> or <strong>phone number</strong> so we can reach you.
      </p>
      <Field label="Message">
        <textarea rows={compact ? 2 : 3} value={form.message} onChange={set("message")} placeholder="Tell us about your study plans…" className={inputCls} />
      </Field>
      <Field label={`Security Check: What is ${cap.q}?`} required>
        <input value={form.answer} onChange={set("answer")} inputMode="numeric" placeholder="Your answer" className={inputCls} />
      </Field>

      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>
      )}

      <button
        type="submit"
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:brightness-110"
      >
        Book Free Counselling
        <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}
