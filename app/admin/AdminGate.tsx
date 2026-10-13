import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/supabase/server";
import { signOut } from "./actions";

/** Server-side guard used by every admin page. */
export async function requireAdminPage() {
  const ctx = await getAdmin();
  if (!ctx.user) redirect("/admin/login");
  return ctx;
}

export function NotAdmin({ email }: { email?: string }) {
  return (
    <div className="container-x py-24 text-center">
      <h1 className="text-3xl">No admin access</h1>
      <p className="mt-3 text-muted">{email} is signed in but isn&apos;t listed as an admin. See the README to grant access.</p>
      <form action={signOut}><button className="mt-6 text-sm font-semibold text-brass">Sign out</button></form>
    </div>
  );
}

export function AdminNav() {
  return (
    <div className="border-b border-black/10 bg-white">
      <div className="container-x flex h-14 items-center justify-between text-sm">
        <div className="flex gap-6 font-medium">
          <Link href="/admin">Listings</Link>
          <Link href="/admin/listings/new">Add listing</Link>
          <Link href="/admin/categories">Categories</Link>
          <Link href="/" target="_blank">View site ↗</Link>
        </div>
        <form action={signOut}><button className="text-muted hover:text-ink">Sign out</button></form>
      </div>
    </div>
  );
}
