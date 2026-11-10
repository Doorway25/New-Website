import { useEffect, useRef, useState } from "react";
import { fetchPublic, mediaUrl, youtubeThumbCandidates } from "../api/client";
import { useSite } from "../api/SiteContext";
import CounsellingSection from "../components/CounsellingSection";
import DoorcastLogo from "../components/DoorcastLogo";
import Icon from "../components/Icon";
import Logo from "../components/Logo";
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

function Thumb({ youtubeId, imageUrl, alt = "", className = "", fit = "cover", short = false }) {
  const candidates = [
    ...(imageUrl && !String(imageUrl).includes("hqdefault") ? [mediaUrl(imageUrl)] : []),
    ...(youtubeId ? (short ? shortThumbCandidates(youtubeId) : youtubeThumbCandidates(youtubeId)) : []),
    ...(imageUrl ? [mediaUrl(imageUrl)] : []),
  ].filter(Boolean);
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
            className="group relative w-[156px] shrink-0 snap-start overflow-hidden rounded-2xl bg-black shadow-lg ring-1 ring-black/10 sm:w-[180px]"
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
          className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg ring-1 ring-slate-200 hover:bg-slate-50"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
        </button>
      ) : null}
      {canNext ? (
        <button
          type="button"
          aria-label="Next shorts"
          onClick={() => scrollBy(1)}
          className="absolute right-0 top-1/2 z-10 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-200 text-slate-700 shadow-lg hover:bg-white"
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
    heroImageUrl: "/doorcast-hero.jpg",
    heroLogoUrl: "",
    brandLogoUrl: "",
    showHeroText: true,
    aboutImageUrl: "",
    aboutLogoUrl: "",
    shortsLogoUrl: "",
    shortsBrandLogoUrl: "",
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
        if (cancelled || !data) return;
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
          heroImageUrl: s.heroImageUrl || "/doorcast-hero.jpg",
          heroLogoUrl: s.heroLogoUrl || "",
          brandLogoUrl: s.brandLogoUrl || "",
          showHeroText: Boolean(s.showHeroText),
          aboutImageUrl: s.aboutImageUrl || "",
          aboutLogoUrl: s.aboutLogoUrl || "",
          shortsLogoUrl: s.shortsLogoUrl || "",
          shortsBrandLogoUrl: s.shortsBrandLogoUrl || "",
          shortsPlaylistUrl: shortsUrl,
          watchNowLabel: s.watchNowLabel || "Watch Now",
          playAllLabel: s.playAllLabel || "Play all one by one",
          moreStoriesLabel: s.moreStoriesLabel || "More video stories",
        });
        if (data.featured?.youtubeId) setFeatured(data.featured);
        else if (Array.isArray(data.episodes) && data.episodes[0]) setFeatured(data.episodes[0]);
        else setFeatured(null);
        if (Array.isArray(data.shorts) && data.shorts.length) setShorts(data.shorts);
        else setShorts([]);
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

  const heroSrc = mediaUrl(meta.heroImageUrl) || "/doorcast-hero.jpg";
  const aboutImg = mediaUrl(meta.aboutImageUrl) || "/doorcast-music.jpg";
  const heroLogo = mediaUrl(meta.heroLogoUrl);
  const aboutLogo = mediaUrl(meta.aboutLogoUrl);
  const shortsLogo = mediaUrl(meta.shortsLogoUrl);
  const brandLogo = mediaUrl(meta.brandLogoUrl);
  const shortsBrandLogo = mediaUrl(meta.shortsBrandLogoUrl);

  /** Locked logo size: 300×200 (upload + display). */
  function LogoBox({ src, alt, light = false, fallback = true, align = "left" }) {
    const box = (
      <div
        className={`inline-flex shrink-0 overflow-hidden ${align === "right" ? "ml-auto" : ""}`}
        style={{ width: 300, height: 200, maxWidth: "100%" }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            width={300}
            height={200}
            className={`h-full w-full object-contain ${align === "right" ? "object-right" : "object-left"}`}
            loading="lazy"
          />
        ) : fallback ? (
          light === false ? (
            <DoorcastLogo light={false} className="h-full w-full" />
          ) : (
            <span className="flex h-full w-full items-center">
              <Logo light={light} />
            </span>
          )
        ) : null}
      </div>
    );
    return box;
  }

  function DoorcastMark({ src, light = true, align = "left" }) {
    if (src) return <LogoBox src={src} alt="DOORCAST" light={light} fallback={false} align={align} />;
    return (
      <div
        className={`inline-flex shrink-0 overflow-hidden ${align === "right" ? "ml-auto" : ""}`}
        style={{ width: 300, height: 200, maxWidth: "100%" }}
      >
        <DoorcastLogo light={light} className="h-full w-full" />
      </div>
    );
  }

  return (
    <>
      <SeoHead
        seo={seoPage}
        title="Doorcast | Education Doorway"
        description={meta.about}
        path="/doorcast"
      />

      {/* 1 · Banner — locked to layout: image, logos 300×200, tagline bottom-left */}
      <section
        className="relative overflow-hidden bg-[#121212] text-white"
        style={{ height: 700, maxHeight: "70vh" }}
      >
        <img
          src={heroSrc}
          alt={meta.showHeroText ? "" : "Doorcast"}
          className="absolute inset-0 h-full w-full object-cover object-center"
          onError={(e) => {
            if (e.currentTarget.src.includes("doorcast-hero")) return;
            e.currentTarget.src = "/doorcast-hero.jpg";
          }}
        />
        {meta.showHeroText ? (
          <div className="container-x relative z-10 flex h-full flex-col justify-between py-8 sm:py-10">
            <div className="flex flex-col items-start">
              <DoorcastMark src={heroLogo} light />
              <div className="-mt-2 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                  Presented by
                </span>
                <LogoBox src={brandLogo} alt={meta.presentedBy || "Education Doorway"} light />
              </div>
            </div>
            <p className="max-w-xl font-display text-lg font-medium italic leading-snug text-white sm:text-xl lg:text-2xl">
              {meta.tagline}
            </p>
          </div>
        ) : (
          <div className="relative z-10 h-full" aria-hidden="true" />
        )}
      </section>

      {/* 2 · Watch Now (left) + About (right) — locked grid */}
      <section className="bg-[#1a1a1a] py-6 sm:py-8">
        <div className="container-x grid items-stretch gap-4 lg:grid-cols-2 lg:gap-5">
          {/* Watch Now — video only card like reference */}
          <button
            type="button"
            onClick={playFeatured}
            className="group relative overflow-hidden rounded-2xl bg-black text-left shadow-xl"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              {featured?.youtubeId || featured?.imageUrl ? (
                <Thumb
                  youtubeId={featured?.youtubeId}
                  imageUrl={featured?.imageUrl}
                  alt={featured?.title || "Doorcast"}
                  className="absolute inset-0 transition duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <img
                  src={heroSrc}
                  alt={featured?.title || "Doorcast episode"}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[#c8102e] shadow-xl transition group-hover:scale-110 sm:h-16 sm:w-16">
                  <PlayIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                </span>
              </span>
              {/* Reference: Watch Now bottom-left */}
              <span
                className="absolute bottom-4 left-4 rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow"
                style={{ backgroundColor: ACCENT }}
              >
                {meta.watchNowLabel || "Watch Now"}
              </span>
              {featured?.duration ? (
                <span className="absolute bottom-4 right-4 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                  {featured.duration}
                </span>
              ) : null}
            </div>
          </button>

          {/* About — mic left, logo/text/CTA right (reference) */}
          <div
            className="relative min-h-[280px] overflow-hidden rounded-2xl shadow-xl sm:min-h-[320px]"
            style={{ backgroundColor: "#cfcfcf" }}
          >
            <img
              src={aboutImg}
              alt="Doorcast studio microphone"
              className="pointer-events-none absolute inset-y-0 left-0 z-0 h-full w-[48%] object-cover"
              style={{ objectPosition: "80% 40%" }}
              loading="lazy"
            />
            <div className="relative z-10 ml-auto flex h-full min-h-[280px] w-full flex-col items-end justify-between gap-5 px-5 py-6 text-right sm:min-h-[320px] sm:w-[58%] sm:px-7 sm:py-7">
              <div
                className="pointer-events-none absolute inset-0"
                style={{ backgroundColor: "rgba(13, 21, 123, 0.55)" }}
                aria-hidden="true"
              />
              <div className="relative z-[2]">
                <DoorcastMark src={aboutLogo} light align="right" />
              </div>
              <p
                className="relative z-[2] max-w-md text-[13px] font-medium leading-relaxed text-white sm:text-[15px] sm:leading-7"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.85)" }}
              >
                {meta.about}
              </p>
              <button
                type="button"
                onClick={playAll}
                className="relative z-[2] inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-sm font-bold text-white shadow-xl transition hover:brightness-110"
                style={{ backgroundColor: ACCENT }}
              >
                {meta.playAllLabel || "Play all one by one"}
                <span className="text-base leading-none">›</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · Shorts — logos 300×200 left, carousel right */}
      <section className="bg-[#f2f2f2] py-10 sm:py-12">
        <div className="container-x grid items-center gap-8 lg:grid-cols-[0.9fr_1.3fr]">
          <div>
            <div className="flex flex-col items-start">
              <DoorcastMark src={shortsLogo} light={false} />
              <div className="-mt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Presented by
                </span>
                <LogoBox src={shortsBrandLogo} alt={meta.presentedBy || "Education Doorway"} />
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#0d157b] sm:text-base">
              {meta.shortsIntro}
            </p>
            <button
              type="button"
              onClick={() =>
                openYoutube(
                  youtubePlaylistUrl(meta.shortsPlaylistUrl) || doorcastMeta.shortsPlaylistUrl
                )
              }
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
            >
              {meta.moreStoriesLabel || "More video stories"} <Icon name="arrow" className="h-4 w-4" />
            </button>
          </div>

          <ShortsCarousel items={shorts} onPlay={playShort} />
        </div>
      </section>

      <CounsellingSection />
    </>
  );
}
