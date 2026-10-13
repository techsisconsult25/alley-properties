"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LISTING_SELECT, type Listing } from "@/lib/types";
import { useFavorites } from "@/components/favorites";
import ListingCard from "@/components/ListingCard";

export default function FavoritesList() {
  const { ids } = useFavorites();
  const [items, setItems] = useState<Listing[] | null>(null);

  useEffect(() => {
    if (!ids.length) {
      setItems([]);
      return;
    }
    createClient()
      .from("listings")
      .select(LISTING_SELECT)
      .in("id", ids)
      .then(({ data }) => setItems((data ?? []) as Listing[]));
  }, [ids]);

  if (items === null) return <p className="mt-10 text-muted">Loading…</p>;
  if (!items.length)
    return (
      <div className="mt-10 rounded-2xl bg-white p-10 text-center">
        <p>No saved items yet — tap the heart on any listing to save it.</p>
        <Link href="/category/houses" className="mt-4 inline-block font-semibold text-brass">Start browsing →</Link>
      </div>
    );
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((l) => <ListingCard key={l.id} listing={l} />)}
    </div>
  );
}
