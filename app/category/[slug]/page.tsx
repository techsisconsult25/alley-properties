import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LISTING_SELECT, type Category, type Listing } from "@/lib/types";
import ListingCard from "@/components/ListingCard";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; status?: string; min?: string; max?: string; location?: string }>;
};

async function getCategory(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
  return data as Category | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCategory(slug);
  if (!c) return { title: "Not found" };
  const description = `${c.tagline ?? ""} Browse ${c.name.toLowerCase()} from Alley Properties in Lagos and Abuja.`.trim();
  return { title: c.name, description, openGraph: { title: `${c.name} | Alley Properties`, description } };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const cat = await getCategory(slug);
  if (!cat) notFound();

  const supabase = await createClient();
  let q = supabase.from("listings").select(LISTING_SELECT).eq("category_id", cat.id);
  if (sp.q) q = q.ilike("title", `%${sp.q}%`);
  if (sp.location) q = q.ilike("location", `%${sp.location}%`);
  if (sp.status === "available" || sp.status === "sold") q = q.eq("status", sp.status);
  if (sp.min) q = q.gte("price", Number(sp.min));
  if (sp.max) q = q.lte("price", Number(sp.max));
  const { data } = await q.order("status").order("created_at", { ascending: false });
  const listings = (data ?? []) as Listing[];

  return (
    <div className="container-x py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">Catalogue</p>
      <h1 className="mt-2 text-5xl">{cat.name}</h1>
      {cat.tagline && <p className="mt-3 max-w-2xl text-muted">{cat.tagline}</p>}

      <form className="mt-10 grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:grid-cols-2 lg:grid-cols-6">
        <input name="q" defaultValue={sp.q} placeholder="Search…" className="input lg:col-span-2" />
        <input name="location" defaultValue={sp.location} placeholder="Location" className="input" />
        <input name="min" type="number" defaultValue={sp.min} placeholder="Min ₦" className="input" />
        <input name="max" type="number" defaultValue={sp.max} placeholder="Max ₦" className="input" />
        <div className="flex gap-2">
          <select name="status" defaultValue={sp.status ?? ""} className="input">
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
          <button className="rounded-lg bg-forest px-4 text-sm font-semibold text-cream">Go</button>
        </div>
      </form>

      <p className="mt-6 text-sm text-muted">{listings.length} result{listings.length === 1 ? "" : "s"}</p>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
      </div>
      {listings.length === 0 && <p className="mt-10 text-center text-muted">No listings match your filters yet.</p>}
    </div>
  );
}
