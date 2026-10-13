import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { coverImage, formatNaira } from "@/lib/utils";
import FavoriteButton from "./FavoriteButton";
import WhatsAppButton from "./WhatsAppButton";
import StatusBadge from "./StatusBadge";

export default function ListingCard({ listing }: { listing: Listing }) {
  const s = listing.specs || {};
  const meta =
    listing.categories?.kind === "furnishing"
      ? [s.material, s.dimensions].filter(Boolean).join(" · ")
      : [s.bedrooms && `${s.bedrooms} bed`, s.bathrooms && `${s.bathrooms} bath`, s.area].filter(Boolean).join(" · ");

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-xl">
      <Link href={`/listing/${listing.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={coverImage(listing)}
          alt={listing.title}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className={`object-cover transition duration-500 group-hover:scale-105 ${listing.status === "sold" ? "grayscale-[60%]" : ""}`}
        />
        <div className="absolute left-3 top-3"><StatusBadge status={listing.status} /></div>
        <FavoriteButton id={listing.id} className="absolute right-3 top-3" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-brass">{listing.categories?.name}</p>
        <Link href={`/listing/${listing.slug}`}>
          <h3 className="text-xl leading-snug hover:text-forest">{listing.title}</h3>
        </Link>
        {listing.location && <p className="text-sm text-muted">{listing.location}</p>}
        {meta && <p className="text-sm text-muted">{meta}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <p className="text-lg font-bold text-forest">
            {formatNaira(listing.price)}
            {listing.price_suffix && <span className="text-sm font-normal text-muted"> {listing.price_suffix}</span>}
          </p>
          {listing.status === "available" && <WhatsAppButton listing={listing} label="Enquire" size="sm" />}
        </div>
      </div>
    </article>
  );
}
