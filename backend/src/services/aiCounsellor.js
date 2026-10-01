import { prisma } from "../lib/prisma.js";

const MAX_HISTORY = 14;
const MAX_MESSAGE_LEN = 1600;

const SUBJECT_ALIASES = {
  engineering: ["engineering", "civil", "mechanical", "electrical", "structural", "construction", "built environment", "biomedical engineering"],
  "computing & technology": ["computing", "computer", "it", "software", "technology", "cs"],
  "data science and analytics": ["data science", "analytics", "data analytics", "big data"],
  "cyber security": ["cyber", "cybersecurity", "information security"],
  "artificial intelligence": ["ai", "artificial intelligence", "machine learning", "ml"],
  "nursing & midwifery": ["nursing", "midwifery", "nurse"],
  medicine: ["medicine", "mbbs", "medical"],
  "health sciences": ["health", "healthcare", "public health"],
  business: ["business", "mba", "management", "commerce"],
  architecture: ["architecture", "architectural"],
  law: ["law", "llb", "legal"],
  pharmacy: ["pharmacy", "pharma"],
  psychology: ["psychology", "psych"],
  education: ["education", "teaching", "pgce"],
  accounting: ["accounting", "accountancy", "acca"],
  finance: ["finance", "banking"],
  marketing: ["marketing"],
  "tourism & hospitality": ["tourism", "hospitality", "hotel"],
};

const PROGRAM_ALIASES = {
  postgraduate: ["masters", "master", "msc", "ma", "mba", "postgraduate", "pg", "graduate", "mres"],
  undergraduate: ["undergraduate", "bachelor", "bachelors", "bsc", "ba", "ug", "undergrad"],
  foundation: ["foundation", "pathway"],
  diploma: ["diploma"],
  phd: ["phd", "doctorate", "doctoral"],
};

function truncate(text, n) {
  const s = String(text || "").trim();
  if (s.length <= n) return s;
  return `${s.slice(0, n - 1)}…`;
}

function tokens(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s&/+.-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function detectPrograms(q) {
  const hits = [];
  for (const [key, aliases] of Object.entries(PROGRAM_ALIASES)) {
    if (aliases.some((a) => q.includes(a))) hits.push(key);
  }
  return hits;
}

function detectCountries(q, countries) {
  return countries.filter((c) => {
    const name = String(c.name || "").toLowerCase();
    const slug = String(c.slug || "").toLowerCase();
    const short = name.replace(/\b(the|of|kingdom|republic)\b/g, " ").replace(/\s+/g, " ").trim();
    return (
      q.includes(slug) ||
      q.includes(name) ||
      (short.length > 3 && q.includes(short)) ||
      (slug === "uk" && (q.includes("uk") || q.includes("united kingdom") || q.includes("britain") || q.includes("england"))) ||
      (slug === "usa" && (q.includes("usa") || q.includes("united states") || q.includes("america")))
    );
  });
}

function detectSubjects(q, subjects) {
  const scored = [];
  for (const s of subjects) {
    const name = String(s.name || "");
    const lower = name.toLowerCase();
    let score = 0;
    if (q.includes(lower)) score += 12;
    for (const part of lower.split(/[\s&/,-]+/).filter((p) => p.length > 3)) {
      if (q.includes(part)) score += 3;
    }
    for (const [canon, aliases] of Object.entries(SUBJECT_ALIASES)) {
      const related =
        lower === canon ||
        lower.includes(canon) ||
        canon.includes(lower) ||
        aliases.some((a) => lower.includes(a));
      if (!related) continue;
      if (aliases.some((a) => q.includes(a)) || q.includes(canon)) score += 8;
    }
    if ((q.includes("civil") || q.includes("structural") || q.includes("construction")) && /engineer/i.test(name)) {
      score += 14;
    }
    if (score > 0) scored.push({ ...s, score });
  }

  // Ensure Engineering appears for civil queries even if weak name match
  if ((q.includes("civil") || q.includes("engineer")) && !scored.some((s) => /engineer/i.test(s.name))) {
    const eng = subjects.find((s) => /engineer/i.test(s.name));
    if (eng) scored.push({ ...eng, score: 12 });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

function scoreUniversity(u, { q, programHits, countryHits, subjectHits, countryName }) {
  let score = 0;
  const reasons = [];
  const subj = (u.subjects || []).map((s) => String(s));
  const progs = (u.programs || []).map((p) => String(p).toLowerCase());
  const hay = `${u.name} ${u.city} ${u.countrySlug} ${subj.join(" ")} ${progs.join(" ")}`.toLowerCase();

  if (countryHits.length) {
    if (countryHits.some((c) => c.slug === u.countrySlug)) {
      score += 14;
      reasons.push(`in ${countryName[u.countrySlug] || u.countrySlug}`);
    } else {
      score -= 4;
    }
  }

  if (programHits.length) {
    const hit = programHits.some((p) => progs.includes(p) || progs.some((x) => x.includes(p)));
    if (hit) {
      score += 12;
      reasons.push(programHits.join("/"));
    } else if (progs.length) {
      score -= 2;
    }
  }

  for (const s of subjectHits.slice(0, 6)) {
    const exact = subj.some((x) => x.toLowerCase() === String(s.name).toLowerCase());
    const soft = subj.some((x) => {
      const xl = x.toLowerCase();
      const nl = String(s.name).toLowerCase();
      return xl.includes(nl) || nl.includes(xl) || (/engineer/i.test(xl) && /engineer/i.test(nl));
    });
    if (exact) {
      score += 16;
      reasons.push(s.name);
    } else if (soft) {
      score += 10;
      reasons.push(s.name);
    }
  }

  // Query words like civil / engineering against university subjects
  if ((q.includes("civil") || q.includes("structural")) && subj.some((s) => /engineer|built|architect|construction/i.test(s))) {
    score += 8;
    reasons.push("Civil / Engineering related");
  }
  if (q.includes("scholarship") || q.includes("funding") || q.includes("full scholarship")) {
    score += 1; // soft boost — all partners may have options; noted in copy
  }
  if (u.featured) score += 2;
  if ((u.upcoming || []).length) score += 1;

  // Weak name token overlap
  for (const t of tokens(u.name)) {
    if (t.length > 4 && q.includes(t)) score += 2;
  }

  if (hay.includes("engineer") && q.includes("engineer")) score += 3;

  return { score, reasons: [...new Set(reasons)].slice(0, 4) };
}

function formatFee(feeFrom, countrySlug) {
  const n = Number(feeFrom) || 0;
  if (!n) return "fee on request";
  if (countrySlug === "uk") return `from £${n.toLocaleString()}`;
  if (["usa", "canada", "australia"].includes(countrySlug)) return `from $${n.toLocaleString()}`;
  if (countrySlug === "malaysia") return `from RM ${n.toLocaleString()}`;
  return `from ${n.toLocaleString()}`;
}

function rankMatches(userText, ctx) {
  const q = String(userText || "").toLowerCase();
  const countryName = Object.fromEntries(ctx.countries.map((c) => [c.slug, c.name]));
  const programHits = detectPrograms(q);
  const countryHits = detectCountries(q, ctx.countries);
  const subjectHits = detectSubjects(q, ctx.subjects);

  const wantsScholarship = /scholarship|funding|full\s*fund|bursary|grant/i.test(q);
  const gpaMatch = q.match(/(\d\.\d{1,2})\s*(?:out of|\/)\s*4/);

  const ranked = ctx.universities
    .map((u) => {
      const { score, reasons } = scoreUniversity(u, { q, programHits, countryHits, subjectHits, countryName });
      return { u, score, reasons };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.u.name.localeCompare(b.u.name));

  // If no country chosen but strong subject/program, still return top subject matches worldwide
  let list = ranked.slice(0, 8);
  if (!list.length && subjectHits.length) {
    list = ctx.universities
      .filter((u) =>
        (u.subjects || []).some((s) =>
          subjectHits.some(
            (h) =>
              String(s).toLowerCase().includes(String(h.name).toLowerCase().split(" ")[0]) ||
              (/engineer/i.test(String(s)) && /engineer/i.test(h.name))
          )
        )
      )
      .slice(0, 8)
      .map((u) => ({ u, score: 5, reasons: [subjectHits[0].name] }));
  }

  return {
    q,
    programHits,
    countryHits,
    subjectHits,
    wantsScholarship,
    gpa: gpaMatch ? gpaMatch[1] : null,
    ranked: list,
    countryName,
  };
}

function buildRealisticReply(userText, ctx) {
  const m = rankMatches(userText, ctx);
  const lines = [];

  lines.push("Thanks for sharing your profile — here’s a realistic shortlist from Education Doorway partner universities.");

  const intentBits = [];
  if (m.programHits.length) intentBits.push(m.programHits.map((p) => p.replace(/-/g, " ")).join(", "));
  if (m.subjectHits.length) intentBits.push(m.subjectHits.slice(0, 3).map((s) => s.name).join(", "));
  if (m.countryHits.length) intentBits.push(m.countryHits.map((c) => c.name).join(", "));
  if (intentBits.length) lines.push(`\nWhat I understood: ${intentBits.join(" · ")}`);
  if (m.gpa) lines.push(`Your CGPA ${m.gpa}/4.00 is competitive for many postgraduate offers (final decision is with the university).`);

  if (m.wantsScholarship) {
    lines.push(
      "\nOn scholarships: “full scholarship” is competitive and not guaranteed. Many partners offer merit awards (often ~10–50% tuition). Our counsellors match your profile to realistic funding options — we cannot promise 100% funding."
    );
  }

  if (m.ranked.length) {
    lines.push("\nRecommended partner options:");
    m.ranked.slice(0, 6).forEach((row, i) => {
      const u = row.u;
      const country = m.countryName[u.countrySlug] || u.countrySlug;
      const intakes = (u.upcoming?.length ? u.upcoming : u.intakes || []).slice(0, 3).join(", ") || "see page";
      const subjects = (u.subjects || [])
        .filter((s) => /engineer|built|architect|construction|civil/i.test(s) || m.subjectHits.some((h) => String(s).toLowerCase().includes(String(h.name).toLowerCase().split(/\s+/)[0])))
        .slice(0, 4);
      const subjShow = (subjects.length ? subjects : (u.subjects || []).slice(0, 3)).join(", ") || "see page";
      const progs = (u.programs || []).slice(0, 3).join(", ") || "see page";
      lines.push(
        `${i + 1}. ${u.name} — ${u.city}, ${country}` +
          `\n   Why: ${row.reasons.join(", ") || "subject / programme fit"}` +
          `\n   Programmes: ${progs} · Subjects: ${subjShow}` +
          `\n   Tuition guide: ${formatFee(u.feeFrom, u.countrySlug)} · Intakes: ${intakes}` +
          `\n   Page: /university/${u.slug}`
      );
    });
  } else {
    lines.push(
      `\nI couldn’t tightly match that yet across our ${ctx.universityCount} partners. Tell me your preferred country (UK / Malaysia / USA / Canada / Australia) and I’ll shortlist Engineering postgraduate options.`
    );
  }

  lines.push(
    "\nNext step: share your preferred country (if not set) + intake month, or tap “Talk to a human” / Apply Now / WhatsApp for document check, scholarship screening and applications."
  );

  return lines.join("\n");
}

export async function buildPartnerContext() {
  const [subjects, universities, countries, programs] = await Promise.all([
    prisma.subject.findMany({
      orderBy: [{ popular: "desc" }, { sortOrder: "asc" }],
      select: { name: true, popular: true },
      take: 200,
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
        featured: true,
        overview: true,
      },
      take: 500,
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

  const subjectLines = subjects.map((s) => `- ${s.name}${s.popular ? " (popular)" : ""}`).join("\n");
  const programLines = programs.map((p) => `- ${p.key}: ${p.name}`).join("\n");

  return {
    subjectLines,
    programLines,
    subjectCount: subjects.length,
    universityCount: universities.length,
    universities,
    subjects,
    countries,
    programs,
    countryName,
  };
}

function shortlistLines(match, limit = 10) {
  if (!match.ranked.length) return "(no close matches — ask clarifying questions)";
  return match.ranked
    .slice(0, limit)
    .map(({ u, reasons }, i) => {
      const country = match.countryName[u.countrySlug] || u.countrySlug;
      const intakes = (u.upcoming?.length ? u.upcoming : u.intakes || []).slice(0, 4).join(", ");
      return `${i + 1}. ${u.name} | ${u.city}, ${country} | feeFrom:${u.feeFrom} | programmes:${(u.programs || []).join(",") || "n/a"} | subjects:${(u.subjects || []).slice(0, 10).join(", ")} | intakes:${intakes || "n/a"} | why:${reasons.join("; ")} | /university/${u.slug}`;
    })
    .join("\n");
}

function buildSystemPrompt(ctx, match) {
  return `You are a senior Education Doorway study counsellor (not a generic chatbot).
Give realistic, honest guidance using ONLY the partner data provided.

Student intent summary:
- Programmes detected: ${match.programHits.join(", ") || "not specified"}
- Subjects detected: ${match.subjectHits.slice(0, 5).map((s) => s.name).join(", ") || "not specified"}
- Countries detected: ${match.countryHits.map((c) => c.name).join(", ") || "not specified"}
- Scholarship interest: ${match.wantsScholarship ? "yes" : "no"}
- GPA mentioned: ${match.gpa || "not specified"}

PRE-MATCHED partner universities (rank by this list first — do not invent others):
${shortlistLines(match, 10)}

All partner subject names (${ctx.subjectCount}):
${ctx.subjectLines}

Programme keys:
${ctx.programLines}

Rules for every reply:
1. Recommend 3–6 universities from the PRE-MATCHED list when available. Include city, country, relevant subjects, intakes, and feeFrom as a guide only.
2. Use real page paths like /university/{slug}.
3. Be realistic about scholarships: never promise full funding; explain merit scholarships are competitive and assessed case-by-case.
4. If country is missing, ask for preferred country AFTER giving a short worldwide Engineering/PG shortlist.
5. Keep tone professional, warm, concise (use short paragraphs + numbered list).
6. End with a clear next step: Talk to a human / Apply Now / WhatsApp for SOP, documents and scholarship screening.
7. Never invent universities, rankings, or exact scholarship amounts not in the data.`;
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
  const lastUser = [...cleaned].reverse().find((m) => m.role === "user")?.content || "";
  const match = rankMatches(lastUser, ctx);

  const apiKey = String(process.env.OPENAI_API_KEY || "").trim();
  const enabled = String(process.env.AI_COUNSELLOR_ENABLED || "true").toLowerCase() !== "false";

  // Always have a strong DB-based reply ready
  const localReply = buildRealisticReply(lastUser, ctx);

  if (!enabled || !apiKey) {
    return {
      reply: localReply,
      mode: apiKey ? "disabled" : "local",
      matches: match.ranked.slice(0, 6).map(({ u, score, reasons }) => ({
        name: u.name,
        slug: u.slug,
        country: u.countrySlug,
        city: u.city,
        score,
        reasons,
      })),
    };
  }

  const model = String(process.env.OPENAI_MODEL || "gpt-4o-mini").trim();
  const system = buildSystemPrompt(ctx, match);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.35,
        max_tokens: 900,
        messages: [{ role: "system", content: system }, ...cleaned],
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("AI counsellor OpenAI error", res.status, body.slice(0, 400));
      return { reply: localReply, mode: "fallback", matches: match.ranked.slice(0, 6) };
    }

    const json = await res.json();
    let reply = String(json?.choices?.[0]?.message?.content || "").trim();
    if (!reply) return { reply: localReply, mode: "fallback" };

    // If model ignored matches, append shortlist for reliability
    if (match.ranked.length && !/\/university\//i.test(reply) && !match.ranked.some(({ u }) => reply.includes(u.name))) {
      reply = `${reply}\n\n---\nPartner shortlist from our database:\n${localReply.split("Recommended partner options:")[1] || ""}`.trim();
    }

    return {
      reply,
      mode: "openai",
      matches: match.ranked.slice(0, 6).map(({ u, score, reasons }) => ({
        name: u.name,
        slug: u.slug,
        country: u.countrySlug,
        city: u.city,
        score,
        reasons,
      })),
    };
  } catch (err) {
    console.error("AI counsellor error", err);
    return { reply: localReply, mode: "fallback" };
  }
}
