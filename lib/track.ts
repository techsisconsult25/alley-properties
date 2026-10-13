"use client";

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

/** Fires a "lead" event to GA4 and a Google Ads conversion (if configured). */
export function trackWhatsAppLead(listing?: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "generate_lead", { method: "whatsapp", item_name: listing ?? "general" });
  const ads = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;
  if (ads && label) window.gtag("event", "conversion", { send_to: `${ads}/${label}` });
}
