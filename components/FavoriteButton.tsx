"use client";
import { useFavorites } from "./favorites";

export default function FavoriteButton({ id, className = "" }: { id: string; className?: string }) {
  const { has, toggle } = useFavorites();
  const active = has(id);
  return (
    <button
      type="button"
      aria-label={active ? "Remove from favourites" : "Save to favourites"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      className={`grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-md transition hover:scale-105 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill={active ? "#c0392b" : "none"} stroke={active ? "#c0392b" : "#16241f"} strokeWidth="2">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  );
}
