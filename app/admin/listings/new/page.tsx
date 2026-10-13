import type { Category } from "@/lib/types";
import { AdminNav, NotAdmin, requireAdminPage } from "../../AdminGate";
import ListingForm from "../../ListingForm";
import { createListing } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Add listing", robots: { index: false } };

export default async function NewListing() {
  const { supabase, user, isAdmin } = await requireAdminPage();
  if (!isAdmin) return <NotAdmin email={user?.email} />;
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return (
    <>
      <AdminNav />
      <div className="container-x py-10">
        <h1 className="mb-6 text-4xl">Add listing</h1>
        <ListingForm categories={(data ?? []) as Category[]} action={createListing} />
      </div>
    </>
  );
}
