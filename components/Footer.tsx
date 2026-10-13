import Link from 'next/link';
import WhatsAppButton from './WhatsAppButton';

export default function Footer() {
  return (
    <footer className="mt-24 bg-forest-deep text-cream">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-3xl">Alley Properties</p>
          <p className="mt-3 max-w-md text-sm text-cream/70">
            Houses for sale, serviced apartments and premium furnishings across
            Uyo and Abuja. Every deal starts with a conversation.
          </p>
          <WhatsAppButton className="mt-6" />
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brass-light">
            Browse
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/category/houses">Houses for Sale</Link>
            </li>
            <li>
              <Link href="/category/serviced-apartments">
                Serviced Apartments
              </Link>
            </li>
            <li>
              <Link href="/category/furnishings">Furnishings</Link>
            </li>
            <li>
              <Link href="/favorites">Saved items</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brass-light">
            Visit
          </p>
          <p className="text-sm text-cream/80">
            12 Admiralty Way, Lekki Phase 1, Uyo
          </p>
          <p className="mt-2 text-sm text-cream/80">Mon–Sat, 9am–6pm</p>
          <p className="mt-2 text-sm text-cream/80">hello@alleyproperties.ng</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Alley Properties ·{' '}
        <Link href="/admin" className="hover:text-cream">
          Admin
        </Link>
      </div>
    </footer>
  );
}
