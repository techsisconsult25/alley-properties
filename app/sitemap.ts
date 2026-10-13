import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { SITE_URL } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = ["", "/about", "/contact"].map((p) => ({ url: `${SITE_URL}${p}` }));
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return base;
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const [{ data: cats }, { data: listings }] = await Promise.all([
      supabase.from("categories").select("slug"),
      supabase.from("listings").select("slug, updated_at"),
    ]);
    return [
      ...base,
      ...(cats ?? []).map((c) => ({ url: `${SITE_URL}/category/${c.slug}` })),
      ...(listings ?? []).map((l) => ({ url: `${SITE_URL}/listing/${l.slug}`, lastModified: l.updated_at })),
    ];
  } catch {
    return base;
  }
}
