import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LISTING_SELECT, type Listing } from "@/lib/types";
import { coverImage, formatNaira, SPEC_LABELS } from "@/lib/utils";
import Gallery from "@/components/Gallery";
import FavoriteButton from "@/components/FavoriteButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import StatusBadge from "@/components/StatusBadge";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

async function getListing(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("listings").select(LISTING_SELECT).eq("slug", slug).maybeSingle();
  return data as Listing | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const l = await getListing(slug);
  if (!l) return { title: "Listing not found", robots: { index: false } };
  const description = `${formatNaira(l.price)}${l.price_suffix ? " " + l.price_suffix : ""} · ${l.location ?? ""}. ${l.description ?? ""}`.slice(0, 160);
  const img = coverImage(l);
  return {
    title: l.title,
    description,
    openGraph: { title: l.title, description, images: [img] },
    twitter: { card: "summary_large_image", title: l.title, description, images: [img] },
  };
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const l = await getListing(slug);
  if (!l) notFound();
  const images = [...(l.listing_images ?? [])].sort((a, b) => a.sort_order - b.sort_order).map((i) => i.url);
  const specs = Object.entries(l.specs ?? {}).filter(([, v]) => v !== "" && v != null);

  return (
    <div className="container-x py-10">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/">Home</Link> /{" "}
        <Link href={`/category/${l.categories?.slug}`}>{l.categories?.name}</Link> / <span className="text-ink">{l.title}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Gallery images={images.length ? images : [coverImage(l)]} alt={l.title} />
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between">
            <StatusBadge status={l.status} />
            <FavoriteButton id={l.id} className="ring-1 ring-black/10" />
          </div>
          <h1 className="mt-4 text-4xl leading-tight">{l.title}</h1>
          {l.location && <p className="mt-2 text-muted">{l.location}</p>}
          <p className="mt-6 text-3xl font-bold text-forest">
            {formatNaira(l.price)}
            {l.price_suffix && <span className="text-base font-normal text-muted"> {l.price_suffix}</span>}
          </p>
          {specs.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-black/10">
              {specs.map(([k, v]) => (
                <div key={k} className="bg-white p-4">
                  <dt className="text-xs uppercase tracking-wider text-muted">{SPEC_LABELS[k] ?? k}</dt>
                  <dd className="mt-1 font-semibold">{String(v)}</dd>
                </div>
              ))}
            </dl>
          )}
          {l.status === "available" ? (
            <WhatsAppButton listing={l} label="Enquire on WhatsApp" className="mt-8 w-full" />
          ) : (
            <div className="mt-8 rounded-xl bg-sand p-4 text-sm">
              This item has been sold. <WhatsAppButton label="Ask about similar options" size="sm" className="mt-3" />
            </div>
          )}
          {l.description && <p className="mt-8 whitespace-pre-line leading-relaxed text-ink/80">{l.description}</p>}
        </aside>
      </div>
    </div>
  );
}
