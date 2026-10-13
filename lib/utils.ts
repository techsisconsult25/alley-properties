import type { Listing } from "./types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348000000000";

export function formatNaira(n: number) {
  return "₦" + new Intl.NumberFormat("en-NG").format(n);
}

export function coverImage(l: Listing) {
  const imgs = [...(l.listing_images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  return imgs[0]?.url ?? "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80";
}

export function whatsappLink(l?: Pick<Listing, "title" | "slug">) {
  const text = l
    ? `Hello Alley Properties, I'm interested in "${l.title}" — ${SITE_URL}/listing/${l.slug}`
    : "Hello Alley Properties, I'd like to make an enquiry.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const SPEC_LABELS: Record<string, string> = {
  bedrooms: "Bedrooms",
  bathrooms: "Bathrooms",
  area: "Size",
  title: "Title document",
  stay: "Stay type",
  material: "Material",
  dimensions: "Dimensions",
  color: "Colour",
};
