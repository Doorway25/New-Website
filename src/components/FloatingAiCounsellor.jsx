import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { postAiCounsellor, submitLead } from "../api/client";
import { useSite } from "../api/SiteContext";
import Icon from "./Icon";

const WELCOME =
  "Hi — I’m your Education Doorway AI Counsellor. Tell me your preferred country, study level, and subject, and I’ll suggest partner universities from our list.";

const SUGGESTIONS = [
  "I want to study in the UK",
  "Best universities for Nursing",
  "Postgraduate options in Malaysia",
  "January / September intakes",
];

export default function FloatingAiCounsellor() {
  const { company } = useSite();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", content: WELCOME }]);
  const [handoff, setHandoff] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", phone: "", email: "" });
  const [leadSent, setLeadSent] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open, busy, handoff]);

  async function send(text) {
    const content = String(text || input).trim();
    if (!content || busy) return;
    setError("");
    setInput("");
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setBusy(true);
    try {
      const history = next
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));
      const data = await postAiCounsellor(history);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "Sorry, I couldn’t reply." }]);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I couldn’t reach the counsellor service right now. Try again, or talk to our team on WhatsApp / Apply Now.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function submitHandoff(e) {
    e.preventDefault();
    if (!leadForm.name.trim() || (!leadForm.phone.trim() && !leadForm.email.trim())) {
      setError("Name and phone or email are required");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const transcript = messages
        .slice(-8)
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n");
      await submitLead({
        type: "ai-counsellor",
        name: leadForm.name.trim(),
        phone: leadForm.phone.trim() || null,
        email: leadForm.email.trim() || null,
        message: "AI Counsellor handoff request",
        meta: { transcript },
      });
      setLeadSent(true);
      setHandoff(false);
    } catch (err) {
      setError(err.message || "Could not send request");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-5 z-40 flex items-center gap-2 rounded-full bg-brand-600 py-3.5 pl-3.5 pr-4 text-white shadow-xl shadow-brand-700/35 transition hover:bg-brand-500 sm:bottom-[5.75rem]"
        aria-label={open ? "Close AI Counsellor" : "Open AI Counsellor"}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
          <Icon name="spark" className="h-4 w-4" />
        </span>
        <span className="hidden text-sm font-semibold sm:inline">AI Counsellor</span>
      </button>

      {open ? (
        <div className="fixed bottom-[9.5rem] right-4 z-50 flex w-[min(100vw-2rem,22.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-brand-950/20 sm:bottom-[10.5rem] sm:right-5">
          <div className="flex items-start justify-between gap-3 bg-gradient-to-br from-brand-700 to-brand-900 px-4 py-3 text-white">
            <div className="min-w-0">
              <p className="font-display text-sm font-bold">AI Counsellor</p>
              <p className="text-[11px] text-white/75">Powered by your partner universities & subjects</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-white/10 px-2 py-1 text-xs font-semibold hover:bg-white/20"
            >
              Close
            </button>
          </div>

          <div ref={listRef} className="max-h-[min(55vh,22rem)] space-y-3 overflow-y-auto bg-slate-50 px-3 py-3">
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-brand-600 text-white"
                      : "rounded-bl-md border border-slate-100 bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {busy ? (
              <p className="text-xs font-medium text-slate-400">Thinking…</p>
            ) : null}
            {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
            {leadSent ? (
              <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                Thanks — our team will contact you soon.
              </p>
            ) : null}
          </div>

          {!handoff ? (
            <>
              <div className="flex flex-wrap gap-1.5 border-t border-slate-100 bg-white px-3 py-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={busy}
                    onClick={() => send(s)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <form
                className="flex gap-2 border-t border-slate-100 bg-white p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about courses, countries…"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
                  disabled={busy}
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-50"
                >
                  Send
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50 px-3 py-2.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setHandoff(true)}
                  className="font-semibold text-brand-700 hover:underline"
                >
                  Talk to a human
                </button>
                <span className="text-slate-300">·</span>
                <Link to="/apply-now" className="font-semibold text-brand-700 hover:underline" onClick={() => setOpen(false)}>
                  Apply Now
                </Link>
                {company?.whatsapp ? (
                  <>
                    <span className="text-slate-300">·</span>
                    <a
                      href={company.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-emerald-700 hover:underline"
                    >
                      WhatsApp
                    </a>
                  </>
                ) : null}
              </div>
            </>
          ) : (
            <form onSubmit={submitHandoff} className="space-y-2 border-t border-slate-100 bg-white p-3">
              <p className="text-xs font-semibold text-ink">Request a human counsellor</p>
              <input
                required
                placeholder="Your name"
                value={leadForm.name}
                onChange={(e) => setLeadForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
              />
              <input
                placeholder="Phone / WhatsApp"
                value={leadForm.phone}
                onChange={(e) => setLeadForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={leadForm.email}
                onChange={(e) => setLeadForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setHandoff(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="flex-1 rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {busy ? "Sending…" : "Send request"}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : null}
    </>
  );
}
