import Image from "next/image";
import Link from "next/link";
import { LISTING_SELECT, type Listing } from "@/lib/types";
import { coverImage, formatNaira } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import { AdminNav, NotAdmin, requireAdminPage } from "./AdminGate";
import { deleteListing, setStatus } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

export default async function AdminHome() {
  const { supabase, user, isAdmin } = await requireAdminPage();
  if (!isAdmin) return <NotAdmin email={user?.email} />;
  const { data } = await supabase.from("listings").select(LISTING_SELECT).order("created_at", { ascending: false });
  const listings = (data ?? []) as Listing[];
  const available = listings.filter((l) => l.status === "available").length;

  return (
    <>
      <AdminNav />
      <div className="container-x py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl">Listings</h1>
            <p className="mt-1 text-sm text-muted">{listings.length} total · {available} available · {listings.length - available} sold</p>
          </div>
          <Link href="/admin/listings/new" className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-cream">+ Add listing</Link>
        </div>
        <div className="mt-8 overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5">
          <table className="w-full text-sm">
            <thead className="bg-sand text-left text-xs uppercase tracking-wider text-muted">
              <tr><th className="p-3">Listing</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} className="border-t border-black/5">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md">
                        <Image src={coverImage(l)} alt="" fill sizes="64px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold">{l.title}{l.featured && <span className="ml-2 text-xs text-brass">★ Featured</span>}</p>
                        <p className="text-xs text-muted">{l.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{l.categories?.name}</td>
                  <td className="p-3 whitespace-nowrap">{formatNaira(l.price)} {l.price_suffix}</td>
                  <td className="p-3"><StatusBadge status={l.status} /></td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2 whitespace-nowrap">
                      <form action={setStatus.bind(null, l.id, l.status === "sold" ? "available" : "sold")}>
                        <button className="rounded-full border border-black/15 px-3 py-1.5 text-xs">Mark {l.status === "sold" ? "available" : "sold"}</button>
                      </form>
                      <Link href={`/admin/listings/${l.id}`} className="rounded-full border border-black/15 px-3 py-1.5 text-xs">Edit</Link>
                      <form action={deleteListing.bind(null, l.id)}>
                        <button className="rounded-full px-3 py-1.5 text-xs text-sold hover:bg-sold/10">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
