import { prisma } from "../lib/prisma.js";

const MAX_HISTORY = 12;
const MAX_MESSAGE_LEN = 1200;

function truncate(text, n) {
  const s = String(text || "").trim();
  if (s.length <= n) return s;
  return `${s.slice(0, n - 1)}…`;
}

export async function buildPartnerContext() {
  const [subjects, universities, countries, programs] = await Promise.all([
    prisma.subject.findMany({
      orderBy: [{ popular: "desc" }, { sortOrder: "asc" }],
      select: { name: true, popular: true },
      take: 80,
    }),
    prisma.university.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
      select: {
        name: true,
        slug: true,
        countrySlug: true,
        city: true,
        feeFrom: true,
        programs: true,
        subjects: true,
        intakes: true,
        upcoming: true,
      },
      take: 120,
    }),
    prisma.country.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, name: true },
    }),
    prisma.program.findMany({
      orderBy: { sortOrder: "asc" },
      select: { key: true, name: true },
    }),
  ]);

  const countryName = Object.fromEntries(countries.map((c) => [c.slug, c.name]));

  const subjectLines = subjects
    .map((s) => `- ${s.name}${s.popular ? " (popular)" : ""}`)
    .join("\n");

  const programLines = programs.map((p) => `- ${p.key}: ${p.name}`).join("\n");

  const uniLines = universities
    .map((u) => {
      const country = countryName[u.countrySlug] || u.countrySlug;
      const subj = (u.subjects || []).slice(0, 8).join(", ");
      const progs = (u.programs || []).slice(0, 5).join(", ");
      const intakes = (u.upcoming?.length ? u.upcoming : u.intakes || []).slice(0, 4).join(", ");
      return `- ${u.name} | ${u.city}, ${country} | feeFrom:${u.feeFrom} | programmes:${progs || "n/a"} | subjects:${subj || "n/a"} | intakes:${intakes || "n/a"} | slug:${u.slug}`;
    })
    .join("\n");

  return {
    subjectLines,
    programLines,
    uniLines,
    subjectCount: subjects.length,
    universityCount: universities.length,
    universities,
    subjects,
    countries,
  };
}

function localFallbackReply(userText, ctx) {
  const q = userText.toLowerCase();
  const matchedSubjects = ctx.subjects
    .filter((s) => q.includes(String(s.name).toLowerCase().slice(0, 12)) || String(s.name).toLowerCase().split(/\s+/).some((w) => w.length > 4 && q.includes(w)))
    .slice(0, 5);

  const matchedUnis = ctx.universities
    .filter((u) => {
      const hay = `${u.name} ${u.city} ${u.countrySlug} ${(u.subjects || []).join(" ")}`.toLowerCase();
      return (
        q.includes(u.name.toLowerCase().split(" ")[0]) ||
        (u.subjects || []).some((s) => q.includes(String(s).toLowerCase().slice(0, 10))) ||
        (matchedSubjects.length && (u.subjects || []).some((s) => matchedSubjects.some((ms) => ms.name === s)))
      );
    })
    .slice(0, 5);

  const countryHit = ctx.countries.find((c) => q.includes(c.name.toLowerCase()) || q.includes(c.slug));

  const lines = [
    "I’m Education Doorway’s study counsellor assistant. Here’s what I found from our partner list:",
  ];

  if (countryHit) {
    const inCountry = ctx.universities.filter((u) => u.countrySlug === countryHit.slug).slice(0, 5);
    lines.push(`\nDestinations — ${countryHit.name}:`);
    inCountry.forEach((u) => {
      lines.push(`• ${u.name} (${u.city}) — subjects: ${(u.subjects || []).slice(0, 4).join(", ") || "see page"}`);
    });
  }

  if (matchedSubjects.length) {
    lines.push(`\nSubject matches: ${matchedSubjects.map((s) => s.name).join(", ")}`);
  }

  if (matchedUnis.length) {
    lines.push("\nPartner universities you may like:");
    matchedUnis.forEach((u) => {
      lines.push(`• ${u.name} — ${u.city} (${u.countrySlug}). Open /university/${u.slug}`);
    });
  }

  if (lines.length === 1) {
    lines.push(
      `\nWe currently list ${ctx.universityCount} partner universities and ${ctx.subjectCount} subject areas.`,
      "Tell me your preferred country (e.g. UK, Malaysia), study level (undergraduate / postgraduate), and subject — I’ll shortlist options.",
      "You can also use Apply Now or WhatsApp for a free human counselling session."
    );
  } else {
    lines.push(
      "\nWant a free human counselling session? Use Apply Now or WhatsApp — our team will guide you on applications and visas."
    );
  }

  return lines.join("\n");
}

function buildSystemPrompt(ctx) {
  return `You are the Education Doorway AI Counsellor for a real education consultancy website.
Help students choose study destinations, programmes, subjects, and partner universities.

Rules:
- ONLY recommend from the partner data below. Do not invent universities or fees.
- Be concise, friendly, and practical (short paragraphs or bullets).
- Ask 1 clarifying question when needed (country, budget, study level, intake).
- For fees, treat feeFrom as a starting guide only; confirm with a human counsellor.
- For visas/offers, say Education Doorway guides students but institutions/governments decide outcomes.
- When ready to apply or speak to a person, suggest Apply Now (/apply-now) or WhatsApp counselling.
- If asked about something outside study-abroad counselling, politely redirect.

Partner subjects (${ctx.subjectCount}):
${ctx.subjectLines || "(none)"}

Programmes:
${ctx.programLines || "(none)"}

Partner universities (${ctx.universityCount}):
${ctx.uniLines || "(none)"}`;
}

export async function chatWithCounsellor({ messages }) {
  if (!Array.isArray(messages) || !messages.length) {
    const err = new Error("messages required");
    err.status = 400;
    throw err;
  }

  const cleaned = messages
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: truncate(m.content, MAX_MESSAGE_LEN),
    }))
    .filter((m) => m.content);

  if (!cleaned.length) {
    const err = new Error("Empty message");
    err.status = 400;
    throw err;
  }

  const ctx = await buildPartnerContext();
  // fix typo if I left "universities universities"
  const lastUser = [...cleaned].reverse().find((m) => m.role === "user")?.content || "";

  const apiKey = String(process.env.OPENAI_API_KEY || "").trim();
  const enabled = String(process.env.AI_COUNSELLOR_ENABLED || "true").toLowerCase() !== "false";

  if (!enabled || !apiKey) {
    return {
      reply: localFallbackReply(lastUser, {
        ...ctx,
        universityCount: ctx.universities.length,
        subjectCount: ctx.subjects.length,
      }),
      mode: apiKey ? "disabled" : "local",
    };
  }

  const model = String(process.env.OPENAI_MODEL || "gpt-4o-mini").trim();
  const system = buildSystemPrompt({
    ...ctx,
    universityCount: ctx.universities.length,
    subjectCount: ctx.subjects.length,
  });

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 700,
      messages: [{ role: "system", content: system }, ...cleaned],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("AI counsellor OpenAI error", res.status, body.slice(0, 400));
    return {
      reply: localFallbackReply(lastUser, {
        ...ctx,
        universityCount: ctx.universities.length,
        subjectCount: ctx.subjects.length,
      }),
      mode: "fallback",
    };
  }

  const json = await res.json();
  const reply = String(json?.choices?.[0]?.message?.content || "").trim();
  if (!reply) {
    return {
      reply: localFallbackReply(lastUser, {
        ...ctx,
        universityCount: ctx.universities.length,
        subjectCount: ctx.subjects.length,
      }),
      mode: "fallback",
    };
  }

  return { reply, mode: "openai" };
}
