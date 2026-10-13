import type { Metadata } from "next";
import Image from "next/image";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "About us",
  description: "Alley Properties helps Nigerians find houses, serviced apartments and quality furnishings — sold through real conversations.",
  openGraph: { title: "About Alley Properties", description: "Houses, serviced apartments and furnishings in Lagos and Abuja." },
};

export default function About() {
  return (
    <div className="container-x grid gap-12 py-16 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">Our story</p>
        <h1 className="mt-2 text-5xl leading-tight">A showroom built around conversations.</h1>
        <p className="mt-6 text-lg text-ink/80">
          Alley Properties brings together homes for sale, serviced apartments and carefully selected furnishings under one roof.
          We believe big decisions deserve real conversations — so instead of a checkout, every listing connects you directly with our team.
        </p>
        <p className="mt-4 text-ink/80">
          From first-time buyers to families upgrading and professionals looking for a comfortable stay, we help you find the right fit and furnish it beautifully.
        </p>
        <WhatsAppButton className="mt-8" />
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
        <Image src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80" alt="Furnished living room" fill className="object-cover" />
      </div>
    </div>
  );
}
