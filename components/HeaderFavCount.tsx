"use client";
import Link from "next/link";
import { useFavorites } from "./favorites";

export default function HeaderFavCount() {
  const { ids } = useFavorites();
  return (
    <Link href="/favorites" className="flex items-center gap-2 rounded-full border border-forest/20 px-3 py-2 text-sm hover:bg-sand">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
      <span>Saved{ids.length ? ` (${ids.length})` : ""}</span>
    </Link>
  );
}
