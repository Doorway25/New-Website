import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useSite } from "../api/SiteContext";

function cleanId(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  // Reject anything that could break out of a script/string context
  if (/[<>"'`]/.test(text) || /\s/.test(text)) return "";
  return text;
}

function ensureScript(id, src, inline) {
  if (document.getElementById(id)) return;
  const el = document.createElement("script");
  el.id = id;
  if (src) {
    el.async = true;
    el.src = src;
  } else if (inline) {
    el.text = inline;
  }
  document.head.appendChild(el);
}

export default function TrackingScripts() {
  const location = useLocation();
  const { ready, seoIntegrations } = useSite();
  const ga = cleanId(seoIntegrations?.googleAnalyticsId);
  const gtm = cleanId(seoIntegrations?.googleTagManagerId);
  const pixel = cleanId(seoIntegrations?.facebookPixelId);
  const clarity = cleanId(seoIntegrations?.microsoftClarityId);
  const gscMeta = String(seoIntegrations?.googleSiteVerification || "").trim().slice(0, 200);
  const bingMeta = String(seoIntegrations?.bingSiteVerification || "").trim().slice(0, 200);

  useEffect(() => {
    if (!ready) return;

    if (gtm) {
      ensureScript(
        "ed-gtm",
        null,
        `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`
      );
      if (!document.getElementById("ed-gtm-noscript")) {
        const ns = document.createElement("noscript");
        ns.id = "ed-gtm-noscript";
        ns.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtm}" height="0" width="0" style="display:none;visibility:hidden" title="gtm"></iframe>`;
        document.body.insertBefore(ns, document.body.firstChild);
      }
    }

    // Skip standalone GA if GTM is present (avoid double-counting when GA lives in GTM)
    if (ga && !gtm) {
      ensureScript("ed-ga-src", `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`);
      ensureScript(
        "ed-ga-config",
        null,
        `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`
      );
    }

    if (pixel) {
      ensureScript(
        "ed-fb-pixel",
        null,
        `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`
      );
    }

    if (clarity) {
      ensureScript(
        "ed-clarity",
        null,
        `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarity}");`
      );
    }
  }, [ready, ga, gtm, pixel, clarity]);

  // SPA route changes → page views (skip first paint; scripts already send initial hit)
  const skipFirstView = useRef(true);
  useEffect(() => {
    if (!ready) return;
    if (skipFirstView.current) {
      skipFirstView.current = false;
      return;
    }
    const path = `${location.pathname}${location.search}`;
    if (typeof window.gtag === "function" && ga && !gtm) {
      window.gtag("config", ga, { page_path: path });
    }
    if (typeof window.fbq === "function" && pixel) {
      window.fbq("track", "PageView");
    }
    if (gtm && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: "page_view", page_path: path });
    }
  }, [ready, location.pathname, location.search, ga, gtm, pixel]);

  if (!ready) return null;

  return (
    <Helmet>
      {gscMeta ? <meta name="google-site-verification" content={gscMeta} /> : null}
      {bingMeta ? <meta name="msvalidate.01" content={bingMeta} /> : null}
    </Helmet>
  );
}
