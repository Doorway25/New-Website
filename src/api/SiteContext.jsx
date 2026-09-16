import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchPublic, mediaUrl, youtubeThumbUrl } from "./client";
import * as fallback from "../data/site";

const SiteContext = createContext(null);

function settingsToCompany(settings) {
  if (!settings) return fallback.company;
  return {
    name: settings.name,
    short: settings.short,
    tagline: settings.tagline,
    since: settings.since,
    phone: settings.phone,
    phoneAlt: settings.phoneAlt,
    email: settings.email,
    hours: settings.hours,
    address: settings.address,
    whatsapp: settings.whatsapp,
    socials: settings.socials || fallback.company.socials,
  };
}

function settingsToSeoIntegrations(settings) {
  if (!settings) {
    return {
      googleAnalyticsId: "",
      googleTagManagerId: "",
      googleSiteVerification: "",
      facebookPixelId: "",
      bingSiteVerification: "",
      microsoftClarityId: "",
    };
  }
  return {
    googleAnalyticsId: settings.googleAnalyticsId || "",
    googleTagManagerId: settings.googleTagManagerId || "",
    googleSiteVerification: settings.googleSiteVerification || "",
    facebookPixelId: settings.facebookPixelId || "",
    bingSiteVerification: settings.bingSiteVerification || "",
    microsoftClarityId: settings.microsoftClarityId || "",
  };
}

function resolveImage(url, fallbackUrl) {
  if (isBrokenRemoteImage(url)) return mediaUrl(fallbackUrl) || fallbackUrl || "";
  return mediaUrl(url) || url || "";
}

function asStringArray(value, fallback = []) {
  if (Array.isArray(value)) return value.map((v) => String(v || "").trim()).filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    // Admin/API sometimes stores a single value as a plain string
    return value.includes(",")
      ? value.split(",").map((s) => s.trim()).filter(Boolean)
      : [value.trim()];
  }
  return Array.isArray(fallback) ? fallback.filter(Boolean) : [];
}

function mapUniversity(u) {
  if (!u) return u;
  const local = fallback.universityBySlug[u.slug] || {};
  return {
    ...local,
    ...u,
    country: u.countrySlug || u.country || local.country,
    overview: u.overview || local.overview || "",
    imageUrl: resolveImage(u.imageUrl, local.imageUrl),
    logoUrl: resolveImage(u.logoUrl, local.logoUrl),
    programs: asStringArray(u.programs, local.programs),
    subjects: asStringArray(u.subjects, local.subjects),
    intakes: asStringArray(u.intakes, local.intakes),
    upcoming: asStringArray(u.upcoming, local.upcoming || local.intakes),
    docs: asStringArray(u.docs, local.docs),
    studentLife: asStringArray(u.studentLife, local.studentLife),
    accommodation: asStringArray(u.accommodation, local.accommodation),
    campus: asStringArray(u.campus, local.campus),
    feeFrom: Number(u.feeFrom ?? local.feeFrom ?? 0) || 0,
  };
}

function toParagraphs(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [];
}

function mapEvent(e) {
  if (!e) return e;
  const local = fallback.eventBySlug?.[e.slug];
  return {
    ...e,
    description: toParagraphs(e.description),
    agenda: Array.isArray(e.agenda) ? e.agenda : [],
    image: resolveImage(e.image, local?.image),
  };
}

function mapEventAlbum(a) {
  if (!a) return a;
  return {
    ...a,
    images: Array.isArray(a.images) ? a.images.map((url) => resolveImage(url)).filter(Boolean) : [],
  };
}

function mapTeamMember(m) {
  if (!m) return m;
  const linkedinUrl = String(m.linkedinUrl || "").trim();
  return {
    ...m,
    imageUrl: resolveImage(m.imageUrl || m.image),
    linkedinUrl: /^https?:\/\//i.test(linkedinUrl) ? linkedinUrl : "",
    bio: m.bio || "",
    roleLabel: m.roleLabel || m.roleKey || "",
  };
}

function normalizeArticleContent(raw) {
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === "string" && raw.trim()) {
    if (/<[a-z][\s\S]*>/i.test(raw)) return [raw];
    return toParagraphs(raw);
  }
  return [];
}

function mapArticle(a) {
  if (!a) return a;
  const local = fallback.articleBySlug?.[a.slug];
  return {
    ...a,
    content: normalizeArticleContent(a.content),
    image: resolveImage(a.image, local?.image),
  };
}

function mapStory(s) {
  if (!s) return s;
  const local = fallback.storyBySlug?.[s.slug];
  const youtubeId = s.youtubeId || local?.youtubeId || "";
  const fromCms = !isBrokenRemoteImage(s.image) ? s.image : "";
  const fromYoutube = youtubeId ? youtubeThumbUrl(youtubeId) : "";
  const fromLocal = local?.image || "";
  return {
    ...local,
    ...s,
    youtubeId,
    text: Array.isArray(s.text) ? s.text : toParagraphs(s.text),
    image: resolveImage(fromCms || fromYoutube || fromLocal, fromYoutube || fromLocal),
  };
}

function isBrokenRemoteImage(url) {
  return !url || /loremflickr\.com/i.test(url);
}

function mapCountry(c) {
  if (!c) return c;
  const fromCity = fallback.cityImage[c.slug];
  return {
    ...c,
    imageUrl: resolveImage(c.imageUrl, fromCity || c.imageUrl),
  };
}

function mapSubjects(list) {
  if (!list?.length) return fallback.subjects;
  if (typeof list[0] === "string") return list;
  return list.map((s) => s.name || s);
}

function mapPopularSubjects(list) {
  if (!list?.length) return fallback.popularSubjects;
  const popular = list
    .filter((s) => s.popular)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((s) => s.name)
    .filter(Boolean);
  // Prefer curated homepage list when CMS has fewer popular flags
  if (popular.length < fallback.popularSubjects.length) {
    return fallback.popularSubjects;
  }
  return popular;
}

function mapBranch(b) {
  if (!b) return b;
  const local = fallback.branchBySlug[b.slug] || {};
  const img = b.image || b.imageUrl || local.image || null;
  const facebookUrl = String(b.facebookUrl || local.facebookUrl || "").trim();
  return {
    ...b,
    image: resolveImage(img, local.image),
    imageUrl: resolveImage(b.imageUrl || b.image || local.image, local.image),
    details: Array.isArray(b.details) && b.details.length ? b.details : local.details || [],
    blurb: b.blurb || local.blurb || "",
    head: b.head === true || local.head === true,
    facebookUrl: /^https?:\/\//i.test(facebookUrl) ? facebookUrl : "",
  };
}

export function SiteProvider({ children }) {
  const [state, setState] = useState({
    ready: false,
    fromApi: false,
    company: fallback.company,
    stats: fallback.stats,
    countries: fallback.countries,
    programs: fallback.programs,
    subjects: fallback.subjects,
    popularSubjects: fallback.popularSubjects,
    universities: fallback.universities,
    articles: fallback.articles,
    events: fallback.events,
    stories: fallback.stories,
    storyCategories: fallback.storyCategories,
    branches: fallback.branches,
    pillars: fallback.pillars,
    testimonials: fallback.testimonials,
    services: fallback.services,
    whyUs: fallback.whyUs,
    partners: fallback.partners,
    pathways: [],
    eventAlbums: [],
    team: fallback.team || [],
    pages: {},
    seoIntegrations: settingsToSeoIntegrations(null),
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [home, uniPage, articlePage, eventPage, storyPage, branches, albumPage, pages] = await Promise.all([
          fetchPublic("/home").catch(() => null),
          fetchPublic("/universities", { pageSize: 500 }).catch(() => ({ items: [] })),
          fetchPublic("/articles", { pageSize: 100 }).catch(() => ({ items: [] })),
          fetchPublic("/events", { pageSize: 100 }).catch(() => ({ items: [] })),
          fetchPublic("/stories", { pageSize: 100 }).catch(() => ({ items: [] })),
          fetchPublic("/branches").catch(() => []),
          fetchPublic("/event-albums").catch(() => ({ items: [] })),
          Promise.all(
            ["home", "about-us", "contact-us", "apply-now", "study", "countries", "courses", "articles", "events", "stories", "study-in-uk", "team"].map((slug) =>
              fetchPublic(`/pages/${slug}`).catch(() => null)
            )
          ),
        ]);

        if (cancelled) return;

        const pageMap = {};
        pages.forEach((p) => {
          if (p?.slug) pageMap[p.slug] = p;
        });

        const subjectsRaw = home?.subjects || [];
        const universities = (uniPage.items || []).map(mapUniversity);
        const branchList = Array.isArray(branches) ? branches : [];

        setState({
          ready: true,
          fromApi: true,
          company: settingsToCompany(home?.settings),
          stats: home?.settings?.stats || fallback.stats,
          seoIntegrations: settingsToSeoIntegrations(home?.settings),
          countries: home?.countries?.length ? home.countries.map(mapCountry) : fallback.countries,
          programs: home?.programs?.length ? home.programs : fallback.programs,
          subjects: mapSubjects(subjectsRaw),
          popularSubjects: mapPopularSubjects(subjectsRaw),
          universities: universities.length ? universities : fallback.universities,
          articles: articlePage.items?.length ? articlePage.items.map(mapArticle) : fallback.articles,
          events: eventPage.items?.length ? eventPage.items.map(mapEvent) : fallback.events,
          stories: storyPage.items?.length ? storyPage.items.map(mapStory) : fallback.stories,
          storyCategories: home?.storyCategories?.length ? home.storyCategories : fallback.storyCategories,
          branches: branchList.length ? branchList.map(mapBranch) : fallback.branches,
          pillars: home?.pillars?.length ? home.pillars : fallback.pillars,
          testimonials: home?.testimonials?.length
            ? home.testimonials.map((t) => ({
                ...t,
                imageUrl: resolveImage(t.imageUrl || t.image),
              }))
            : fallback.testimonials,
          services: home?.services?.length ? home.services : fallback.services,
          whyUs: home?.whyUs?.length ? home.whyUs : fallback.whyUs,
          partners: home?.partners?.length
            ? home.partners.map((p) => (typeof p === "string" ? p : p.slug))
            : fallback.partners,
          pathways: Array.isArray(home?.pathways)
            ? home.pathways.map((p) => ({
                ...p,
                imageUrl: resolveImage(p.imageUrl),
              }))
            : [],
          eventAlbums: Array.isArray(albumPage?.items)
            ? albumPage.items.map(mapEventAlbum)
            : [],
          team: Array.isArray(home?.team) ? home.team.map(mapTeamMember) : fallback.team || [],
          pages: pageMap,
        });
      } catch {
        if (!cancelled) setState((s) => ({ ...s, ready: true, fromApi: false }));
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => {
    const countryBySlug = Object.fromEntries(state.countries.map((c) => [c.slug, c]));
    const universityBySlug = Object.fromEntries(state.universities.map((u) => [u.slug, u]));
    const articleBySlug = Object.fromEntries(state.articles.map((a) => [a.slug, a]));
    const eventBySlug = Object.fromEntries(state.events.map((e) => [e.slug, e]));
    const storyBySlug = Object.fromEntries(state.stories.map((s) => [s.slug, s]));
    const storyCategoryByKey = Object.fromEntries(state.storyCategories.map((c) => [c.key, c]));
    const branchBySlug = Object.fromEntries(state.branches.map((b) => [b.slug, b]));
    const pillarBySlug = Object.fromEntries(state.pillars.map((p) => [p.slug, p]));
    const teamBySlug = Object.fromEntries(state.team.map((m) => [m.slug, m]));

    return {
      ...state,
      countryBySlug,
      universityBySlug,
      articleBySlug,
      eventBySlug,
      storyBySlug,
      storyCategoryByKey,
      branchBySlug,
      pillarBySlug,
      teamBySlug,
      monogram: fallback.monogram,
      gradientFor: fallback.gradientFor,
      formatDate: fallback.formatDate,
      countUniversities: (slug) =>
        state.universities.filter((u) => (u.country || u.countrySlug) === slug).length,
      cityImage: fallback.cityImage,
      getPage: (slug) => state.pages[slug] || null,
    };
  }, [state]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
