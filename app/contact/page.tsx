import type { Metadata } from "next";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Contact",
  description: "Chat with Alley Properties on WhatsApp or visit our Lekki showroom.",
  openGraph: { title: "Contact Alley Properties", description: "Chat with us on WhatsApp or visit our showroom." },
};

export default function Contact() {
  return (
    <div className="container-x py-16">
      <h1 className="text-5xl">Let&apos;s talk</h1>
      <p className="mt-3 max-w-xl text-muted">The fastest way to reach us is WhatsApp — we typically reply within minutes during business hours.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-8 ring-1 ring-black/5">
          <h2 className="text-2xl">WhatsApp</h2>
          <p className="mt-2 text-sm text-muted">Enquiries, viewings, reservations.</p>
          <WhatsAppButton className="mt-6" />
        </div>
        <div className="rounded-2xl bg-white p-8 ring-1 ring-black/5">
          <h2 className="text-2xl">Showroom</h2>
          <p className="mt-2 text-sm text-muted">12 Admiralty Way, Lekki Phase 1, Lagos</p>
          <p className="mt-1 text-sm text-muted">Mon–Sat, 9am–6pm</p>
        </div>
        <div className="rounded-2xl bg-white p-8 ring-1 ring-black/5">
          <h2 className="text-2xl">Email</h2>
          <p className="mt-2 text-sm text-muted">hello@alleyproperties.ng</p>
        </div>
      </div>
    </div>
  );
}
