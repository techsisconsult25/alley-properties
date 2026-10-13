import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LISTING_SELECT, type Category, type Listing } from '@/lib/types';
import ListingCard from '@/components/ListingCard';
import WhatsAppButton from '@/components/WhatsAppButton';

export const revalidate = 60;

const CAT_IMAGES: Record<string, string> = {
  houses:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
  'serviced-apartments':
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
  furnishings:
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
};

export default async function Home() {
  const supabase = await createClient();
  const [{ data: cats }, { data: featured }] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order'),
    supabase
      .from('listings')
      .select(LISTING_SELECT)
      .eq('featured', true)
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(6),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-forest-deep text-cream">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=80"
          alt="Modern home exterior at dusk"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="container-x relative py-28 md:py-40">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brass-light">
            Uyo · Abuja
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
            Homes, stays &amp; pieces worth talking about.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/80">
            Browse houses for sale, serviced apartments and premium furnishings.
            Save what you love, then chat with us directly on WhatsApp.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/category/houses"
              className="rounded-full bg-brass px-6 py-3 text-sm font-semibold text-forest-deep hover:bg-brass-light"
            >
              Explore the showroom
            </Link>
            <WhatsAppButton />
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <h2 className="mb-10 text-4xl">Three ways to find your fit</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {(cats as Category[] | null)?.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-3xl"
            >
              <Image
                src={CAT_IMAGES[c.slug] ?? CAT_IMAGES.houses}
                alt={c.name}
                fill
                sizes="33vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/20 to-transparent" />
              <div className="absolute bottom-0 p-7 text-cream">
                <h3 className="text-3xl">{c.name}</h3>
                <p className="mt-2 text-sm text-cream/80">{c.tagline}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-brass-light">
                  Browse →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-sand py-20">
        <div className="container-x">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">
            Hand-picked
          </p>
          <h2 className="mt-2 text-4xl">Featured this week</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(featured as Listing[] | null)?.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-x grid gap-10 py-20 md:grid-cols-3">
        {[
          [
            'Verified listings',
            'Every house, apartment and piece is inspected and clearly marked Available or Sold.',
          ],
          [
            'Shortlist freely',
            "Tap the heart to save favourites and come back whenever you're ready.",
          ],
          [
            'Talk to a real person',
            'Every enquiry goes straight to our team on WhatsApp — no forms, no waiting.',
          ],
        ].map(([t, d]) => (
          <div key={t} className="border-t-2 border-brass pt-6">
            <h3 className="text-2xl">{t}</h3>
            <p className="mt-3 text-muted">{d}</p>
          </div>
        ))}
      </section>

      <section className="container-x">
        <div className="rounded-3xl bg-forest px-8 py-14 text-center text-cream md:px-16">
          <h2 className="text-4xl">Seen something you like?</h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/80">
            Send us a message and we&apos;ll share more photos, arrange a
            viewing or reserve it for you.
          </p>
          <WhatsAppButton className="mt-8" />
        </div>
      </section>
    </>
  );
}
