import type { Metadata } from "next";
import FavoritesList from "./FavoritesList";

export const metadata: Metadata = {
  title: "Saved items",
  description: "Your shortlisted houses, serviced apartments and furnishings from Alley Properties.",
  robots: { index: false },
};

export default function FavoritesPage() {
  return (
    <div className="container-x py-14">
      <h1 className="text-5xl">Your saved items</h1>
      <p className="mt-3 text-muted">Saved on this device. Ready to talk? Tap Enquire on any item.</p>
      <FavoritesList />
    </div>
  );
}
