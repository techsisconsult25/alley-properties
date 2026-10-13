import { notFound } from "next/navigation";
import { LISTING_SELECT, type Category, type Listing } from "@/lib/types";
import { AdminNav, NotAdmin, requireAdminPage } from "../../AdminGate";
import ListingForm from "../../ListingForm";
import { updateListing } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit listing", robots: { index: false } };

export default async function EditListing({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user, isAdmin } = await requireAdminPage();
  if (!isAdmin) return <NotAdmin email={user?.email} />;
  const [{ data: cats }, { data: listing }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("listings").select(LISTING_SELECT).eq("id", id).maybeSingle(),
  ]);
  if (!listing) notFound();
  return (
    <>
      <AdminNav />
      <div className="container-x py-10">
        <h1 className="mb-6 text-4xl">Edit: {(listing as Listing).title}</h1>
        <ListingForm categories={(cats ?? []) as Category[]} listing={listing as Listing} action={updateListing.bind(null, id)} />
      </div>
    </>
  );
}
