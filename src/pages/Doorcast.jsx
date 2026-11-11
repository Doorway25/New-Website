import { useEffect, useRef, useState } from "react";
import { fetchPublic, mediaUrl, youtubeThumbCandidates } from "../api/client";
import { useSite } from "../api/SiteContext";
import CounsellingSection from "../components/CounsellingSection";
import Icon from "../components/Icon";
import SeoHead from "../components/SeoHead";
import { doorcastEpisodes, doorcastMeta, doorcastShorts } from "../data/doorcast";

const ACCENT = "#c8102e";

function PlayIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.28-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function shortThumbCandidates(youtubeId) {
  if (!youtubeId) return [];
  // Prefer Shorts / vertical frames, then standard qualities
  return [
    `https://i.ytimg.com/vi/${youtubeId}/oar2.jpg`,
    `https://i.ytimg.com/vi/${youtubeId}/hq720.jpg`,
    ...youtubeThumbCandidates(youtubeId),
  ];
}

function Thumb({ youtubeId, imageUrl, alt = "", className = "", fit = "cover", short = false, preferYoutube = false }) {
  const customImage =
    imageUrl && !String(imageUrl).includes("hqdefault") ? mediaUrl(imageUrl) : "";
  const yt = youtubeId ? (short ? shortThumbCandidates(youtubeId) : youtubeThumbCandidates(youtubeId)) : [];
  const candidates = (
    preferYoutube
      ? [...yt, customImage, imageUrl ? mediaUrl(imageUrl) : ""]
      : [customImage, ...yt, imageUrl ? mediaUrl(imageUrl) : ""]
  ).filter(Boolean);
  const [i, setI] = useState(0);
  const src = candidates[i] || "";
  if (!src) {
    return <div className={`bg-gradient-to-br from-slate-800 to-slate-950 ${className}`} />;
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (i < candidates.length - 1) setI((n) => n + 1);
      }}
      className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${className}`}
    />
  );
}

function openYoutube(url) {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

function youtubeWatchUrl(id) {
  return id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : "";
}

function youtubeShortsUrl(id) {
  return id ? `https://www.youtube.com/shorts/${encodeURIComponent(id)}` : "";
}

function youtubePlaylistUrl(raw) {
  const value = String(raw || "").trim();
  if (!value) return "";
  try {
    const url = new URL(value);
    const list = url.searchParams.get("list");
    if (list) return `https://www.youtube.com/playlist?list=${encodeURIComponent(list)}`;
  } catch {
    /* plain id */
  }
  if (/^PL[\w-]+$/i.test(value)) {
    return `https://www.youtube.com/playlist?list=${encodeURIComponent(value)}`;
  }
  return value;
}

function ShortsCarousel({ items, onPlay }) {
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  function updateArrows() {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [items]);

  useEffect(() => {
    if (!items?.length) return undefined;
    const timer = window.setInterval(() => {
      if (pausedRef.current) return;
      const el = trackRef.current;
      if (!el) return;
      const step = Math.min(200, Math.max(160, el.clientWidth * 0.45));
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 12;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 2800);
    return () => window.clearInterval(timer);
  }, [items]);

  function scrollBy(dir) {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(320, el.clientWidth * 0.75) * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }

  if (!items?.length) return null;

  return (
    <div
      className="relative min-w-0"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocusCapture={() => {
        pausedRef.current = true;
      }}
      onBlurCapture={() => {
        pausedRef.current = false;
      }}
    >
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 pr-10"
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onPlay(item)}
            className="group relative w-[140px] shrink-0 snap-start overflow-hidden rounded-xl bg-black shadow-lg ring-1 ring-black/10 sm:w-[180px] sm:rounded-2xl"
          >
            <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
              <Thumb
                youtubeId={item.youtubeId}
                imageUrl={item.imageUrl}
                alt={item.title}
                short
                fit="contain"
                className="absolute inset-0 transition duration-500 group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-[#c8102e] shadow-lg transition group-hover:scale-110">
                  <PlayIcon className="h-5 w-5" />
                </span>
              </span>
              <div className="absolute inset-x-0 bottom-0 p-3 text-left">
                <p className="line-clamp-3 text-[11px] font-semibold leading-snug text-white drop-shadow">{item.title}</p>
                {item.subtitle ? (
                  <p className="mt-1 truncate text-[10px] text-white/75">{item.subtitle}</p>
                ) : null}
              </div>
            </div>
          </button>
        ))}
      </div>

      {canPrev ? (
        <button
          type="button"
          aria-label="Previous shorts"
          onClick={() => scrollBy(-1)}
          className="absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg ring-1 ring-slate-200 hover:bg-slate-50 sm:left-0 sm:h-10 sm:w-10 sm:-translate-x-1/2"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
        </button>
      ) : null}
      {canNext ? (
        <button
          type="button"
          aria-label="Next shorts"
          onClick={() => scrollBy(1)}
          className="absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-200 text-slate-700 shadow-lg hover:bg-white sm:right-0 sm:h-10 sm:w-10 sm:translate-x-1/2"
        >
          <Icon name="arrow" className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

export default function Doorcast() {
  const { getPage } = useSite();
  const seoPage = getPage("doorcast");
  const [meta, setMeta] = useState({
    ...doorcastMeta,
    heroImageUrl: "/doorcast-hero.webp",
    heroLogoUrl: "/doorcast-logo-white.png",
    brandLogoUrl: "/doorway-logo-white.png",
    showHeroText: true,
    aboutImageUrl: "/doorcast-music.jpg",
    aboutLogoUrl: "/doorcast-logo-white.png",
    shortsLogoUrl: "/doorcast-logo-color.png",
    shortsBrandLogoUrl: "/doorway-logo-color.png",
    shortsPlaylistUrl: doorcastMeta.shortsPlaylistUrl,
    watchNowLabel: "Watch Now",
    playAllLabel: "Play all one by one",
    moreStoriesLabel: "More video stories",
  });
  const [featured, setFeatured] = useState(doorcastEpisodes[0] || null);
  const [shorts, setShorts] = useState(doorcastShorts);

  useEffect(() => {
    let cancelled = false;
    fetchPublic("/doorcast")
      .then((data) => {
        // API/DB errors sometimes return { error } with HTTP 200 — keep local fallbacks
        if (cancelled || !data || data.error) return;
        const s = data.settings || {};
        const shortsUrl = s.shortsPlaylistId
          ? `https://www.youtube.com/playlist?list=${encodeURIComponent(s.shortsPlaylistId)}`
          : doorcastMeta.shortsPlaylistUrl;
        setMeta({
          title: "DOORCAST",
          tagline: s.tagline || doorcastMeta.tagline,
          presentedBy: s.presentedBy || doorcastMeta.presentedBy,
          about: s.about || doorcastMeta.about,
          shortsIntro: s.shortsIntro || doorcastMeta.shortsIntro,
          playlistUrl: s.playlistUrl || doorcastMeta.playlistUrl,
          heroImageUrl: s.heroImageUrl || "/doorcast-hero.webp",
          heroLogoUrl: s.heroLogoUrl || "/doorcast-logo-white.png",
          brandLogoUrl: s.brandLogoUrl || "/doorway-logo-white.png",
          showHeroText: s.showHeroText !== false,
          aboutImageUrl: s.aboutImageUrl || "/doorcast-music.jpg",
          aboutLogoUrl: s.aboutLogoUrl || "/doorcast-logo-white.png",
          shortsLogoUrl: s.shortsLogoUrl || "/doorcast-logo-color.png",
          shortsBrandLogoUrl: s.shortsBrandLogoUrl || "/doorway-logo-color.png",
          shortsPlaylistUrl: shortsUrl,
          watchNowLabel: s.watchNowLabel || "Watch Now",
          playAllLabel: s.playAllLabel || "Play all one by one",
          moreStoriesLabel: s.moreStoriesLabel || "More video stories",
        });
        if (data.featured?.youtubeId) setFeatured(data.featured);
        else if (Array.isArray(data.episodes) && data.episodes[0]?.youtubeId) {
          setFeatured(data.episodes[0]);
        }
        // else keep static doorcastEpisodes fallback

        if (Array.isArray(data.shorts) && data.shorts.length) setShorts(data.shorts);
        // else keep static doorcastShorts fallback
      })
      .catch(() => {
        /* keep static fallbacks */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function playFeatured() {
    if (featured?.youtubeId) {
      openYoutube(youtubeWatchUrl(featured.youtubeId));
      return;
    }
    playAll();
  }

  function playShort(item) {
    if (item?.youtubeId) {
      openYoutube(youtubeShortsUrl(item.youtubeId));
      return;
    }
    playAll();
  }

  function playAll() {
    openYoutube(youtubePlaylistUrl(meta.playlistUrl) || doorcastMeta.playlistUrl);
  }

  // Banner uses the shared crisp hero; about image can come from CMS.
  const heroSrc = "/doorcast-hero.webp";
  const aboutImg = mediaUrl(meta.aboutImageUrl) || "/doorcast-music.jpg";
  const LOGO_DC_WHITE = "/doorcast-logo-white.png";
  const LOGO_DC_COLOR = "/doorcast-logo-color.png";
  const LOGO_ED_WHITE = "/doorway-logo-white.png";
  const LOGO_ED_COLOR = "/doorway-logo-color.png";

  return (
    <>
      <SeoHead
        seo={seoPage}
        title="Doorcast | Education Doorway"
        description={meta.about}
        path="/doorcast"
      />

      {/* 1 · Banner — taller hero, readable lockup, ON AIR on the right */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="relative h-[280px] w-full sm:h-[340px] md:h-[400px] lg:h-[440px]">
          <img
            src={heroSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[82%_center] sm:object-[72%_center] md:object-[68%_center]"
            onError={(e) => {
              if (e.currentTarget.src.includes("doorcast-hero.webp")) {
                e.currentTarget.src = "/doorcast-hero.jpg";
                return;
              }
              if (e.currentTarget.src.includes("doorcast-hero")) return;
              e.currentTarget.src = "/doorcast-hero.webp";
            }}
          />
          {/* Strong left scrim so logos + tagline stay readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/15 sm:from-black/95 sm:via-black/55 sm:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />

          {meta.showHeroText ? (
            <div className="container-x relative z-10 flex h-full items-center py-8 sm:py-10 md:py-12">
              <div className="flex max-w-xl flex-col items-start gap-3 sm:gap-3.5 md:gap-4">
                <img
                  src={LOGO_DC_WHITE}
                  alt="DOORCAST"
                  width={360}
                  height={72}
                  style={{ height: 48, width: "auto", maxWidth: 280 }}
                  className="object-contain object-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] sm:!h-14 sm:!max-w-[340px] md:!h-16 md:!max-w-[400px]"
                />
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <span className="text-xs font-medium tracking-wide text-white/90 sm:text-sm">
                    Presented by
                  </span>
                  <img
                    src={LOGO_ED_WHITE}
                    alt="Education Doorway"
                    width={180}
                    height={36}
                    style={{ height: 28, width: "auto", maxWidth: 160 }}
                    className="object-contain object-left drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] sm:!h-8 sm:!max-w-[190px] md:!h-9 md:!max-w-[210px]"
                  />
                </div>
                <p
                  className="max-w-md font-display text-base font-medium italic leading-relaxed text-white sm:max-w-lg sm:text-lg md:text-xl"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.75)" }}
                >
                  {meta.tagline || "Beyond the Conversation. Into Your Future."}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* 2 · Watch Now + About */}
      <section className="bg-[#151515] py-4 sm:py-6 md:py-8">
        <div className="container-x grid min-w-0 gap-4 sm:gap-5 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <button
            type="button"
            onClick={playFeatured}
            className="group relative aspect-video w-full min-w-0 overflow-hidden rounded-xl bg-black text-left shadow-xl ring-1 ring-white/10 sm:rounded-2xl"
          >
            {featured?.youtubeId || featured?.imageUrl ? (
              <Thumb
                youtubeId={featured?.youtubeId}
                imageUrl={featured?.imageUrl}
                alt={featured?.title || "Doorcast"}
                preferYoutube
                className="absolute inset-0 h-full w-full scale-[1.18] object-cover object-center transition duration-500 group-hover:scale-[1.22]"
              />
            ) : (
              <img
                src={heroSrc}
                alt={featured?.title || "Doorcast episode"}
                className="absolute inset-0 h-full w-full scale-[1.05] object-cover object-center transition duration-500 group-hover:scale-[1.09]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-[#c8102e] shadow-xl transition group-hover:scale-110 sm:mb-5 sm:h-16 sm:w-16">
                <PlayIcon className="h-5 w-5 sm:h-7 sm:w-7" />
              </span>
            </span>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-3 pb-3 pt-12 sm:px-5 sm:pb-5 sm:pt-14">
              <span
                className="rounded px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-md sm:px-4 sm:py-2 sm:text-sm"
                style={{ backgroundColor: ACCENT }}
              >
                {meta.watchNowLabel || "Watch Now"}
              </span>
              {featured?.duration ? (
                <span className="rounded bg-black/75 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm sm:px-2.5 sm:py-1.5 sm:text-xs">
                  {featured.duration}
                </span>
              ) : null}
            </div>
          </button>

          {/* Mobile: auto height so about text isn't clipped; desktop keeps 16:9 */}
          <div className="relative min-h-[240px] min-w-0 overflow-hidden rounded-xl bg-[#101010] shadow-xl ring-1 ring-white/10 sm:min-h-0 sm:rounded-2xl sm:aspect-video">
            <img
              src={aboutImg}
              alt=""
              className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
              style={{ objectPosition: "22% 42%" }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/35 sm:bg-gradient-to-l sm:from-black/85 sm:via-black/50 sm:to-black/15" />
            <div className="relative z-10 flex h-full w-full flex-col items-start justify-between gap-3 p-4 text-left sm:ml-auto sm:w-[64%] sm:items-end sm:gap-3 sm:p-6 sm:pr-7 sm:text-right md:w-[58%]">
              <img
                src={LOGO_DC_WHITE}
                alt="DOORCAST"
                width={240}
                height={48}
                style={{ height: 32, width: "auto", maxWidth: 200 }}
                className="shrink-0 object-contain sm:!h-10 sm:!max-w-[250px]"
              />
              <p
                className="max-w-md text-[12px] font-medium leading-relaxed text-white/95 sm:flex-1 sm:text-[13px] sm:leading-6"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
              >
                {meta.about}
              </p>
              <button
                type="button"
                onClick={playAll}
                className="inline-flex max-w-full shrink-0 items-center gap-2 rounded-sm px-3.5 py-2 text-xs font-bold text-white shadow-lg transition hover:brightness-110 sm:px-4 sm:py-2.5 sm:text-sm"
                style={{ backgroundColor: ACCENT }}
              >
                <span className="truncate">{meta.playAllLabel || "Play all one by one"}</span>
                <span className="shrink-0 text-base leading-none">›</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · Shorts */}
      <section className="overflow-x-clip bg-[#f2f2f2] py-5 sm:py-6 md:py-8">
        <div className="container-x grid min-w-0 items-center gap-5 sm:gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
          <div className="flex min-w-0 flex-col items-start gap-2">
            <img
              src={LOGO_DC_COLOR}
              alt="DOORCAST"
              width={420}
              height={80}
              className="h-11 w-auto max-h-11 max-w-[min(90vw,320px)] object-contain object-left sm:h-12 sm:max-h-12 sm:max-w-[360px] md:h-14 md:max-h-14 md:max-w-[400px]"
            />
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Presented by
              </span>
              <img
                src={LOGO_ED_COLOR}
                alt="Education Doorway"
                width={200}
                height={40}
                className="h-8 w-auto max-h-8 max-w-[170px] object-contain object-left sm:h-9 sm:max-h-9 sm:max-w-[190px]"
              />
            </div>
            <p className="mt-1 max-w-sm text-sm leading-relaxed text-[#0d157b] sm:text-base">
              {meta.shortsIntro}
            </p>
            <button
              type="button"
              onClick={() =>
                openYoutube(
                  youtubePlaylistUrl(meta.shortsPlaylistUrl) || doorcastMeta.shortsPlaylistUrl
                )
              }
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
            >
              {meta.moreStoriesLabel || "More video stories"} <Icon name="arrow" className="h-4 w-4" />
            </button>
          </div>

          <div className="min-w-0">
            <ShortsCarousel items={shorts} onPlay={playShort} />
          </div>
        </div>
      </section>

      <CounsellingSection />
    </>
  );
}
