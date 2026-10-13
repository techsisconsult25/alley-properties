import Link from "next/link";
import HeaderFavCount from "./HeaderFavCount";

const nav = [
  { href: "/category/houses", label: "Houses for Sale" },
  { href: "/category/serviced-apartments", label: "Serviced Apartments" },
  { href: "/category/furnishings", label: "Furnishings" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-1">
          <span className="font-serif text-2xl font-semibold text-forest">Alley</span>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">Properties</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-brass">{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <HeaderFavCount />
          <details className="relative lg:hidden">
            <summary className="cursor-pointer list-none rounded-full border border-forest/20 px-3 py-2 text-sm">Menu</summary>
            <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white p-2 shadow-xl">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-sand">{n.label}</Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
