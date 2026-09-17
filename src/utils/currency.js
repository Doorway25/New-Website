/** Country slug → ISO currency for tuition display */
const COUNTRY_CURRENCY = {
  uk: "GBP",
  ireland: "EUR",
  france: "EUR",
  germany: "EUR",
  netherlands: "EUR",
  spain: "EUR",
  malta: "EUR",
  australia: "AUD",
  canada: "CAD",
  usa: "USD",
  malaysia: "MYR",
  uae: "AED",
  ksa: "SAR",
  dubai: "AED",
};

/** Prefer readable symbols for common study destinations */
const CURRENCY_LOCALE = {
  GBP: "en-GB",
  EUR: "en-IE",
  AUD: "en-AU",
  CAD: "en-CA",
  USD: "en-US",
  MYR: "en-MY",
  AED: "en-AE",
  SAR: "en-SA",
};

export function currencyForCountry(countrySlug) {
  const key = String(countrySlug || "").toLowerCase().trim();
  return COUNTRY_CURRENCY[key] || "USD";
}

/**
 * Format tuition in the destination country's currency.
 * Values in CMS are stored as local currency amounts (not converted).
 */
export function formatTuition(amount, countrySlug, { perYear = false } = {}) {
  const value = Number(amount);
  const safe = Number.isFinite(value) ? value : 0;
  const currency = currencyForCountry(countrySlug);
  const locale = CURRENCY_LOCALE[currency] || "en";

  let formatted;
  try {
    formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(safe);
  } catch {
    formatted = `${currency} ${safe.toLocaleString()}`;
  }

  return perYear ? `${formatted}/yr` : formatted;
}

/** Short label for admin hints, e.g. "GBP (£)" */
export function currencyLabelForCountry(countrySlug) {
  const currency = currencyForCountry(countrySlug);
  const sample = formatTuition(0, countrySlug).replace(/[\d.,\s]/g, "").trim() || currency;
  return `${currency}${sample && sample !== currency ? ` (${sample})` : ""}`;
}
