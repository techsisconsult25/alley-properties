import type { Category } from "@/lib/types";
import { AdminNav, NotAdmin, requireAdminPage } from "../AdminGate";
import { addCategory, deleteCategory } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories", robots: { index: false } };

export default async function Categories() {
  const { supabase, user, isAdmin } = await requireAdminPage();
  if (!isAdmin) return <NotAdmin email={user?.email} />;
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  const cats = (data ?? []) as Category[];
  return (
    <>
      <AdminNav />
      <div className="container-x grid gap-10 py-10 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl">Categories</h1>
          <ul className="mt-6 divide-y divide-black/5 rounded-2xl bg-white ring-1 ring-black/5">
            {cats.map((c) => (
              <li key={c.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted">/category/{c.slug} · {c.kind}</p>
                </div>
                <form action={deleteCategory.bind(null, c.id)}>
                  <button className="text-xs text-sold">Delete</button>
                </form>
              </li>
            ))}
          </ul>
        </div>
        <form action={addCategory} className="h-fit space-y-4 rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <h2 className="text-2xl">Add category</h2>
          <input name="name" required placeholder="Name, e.g. Land for Sale" className="input" />
          <input name="tagline" placeholder="Short description" className="input" />
          <select name="kind" className="input">
            <option value="property">Property</option>
            <option value="furnishing">Furnishing</option>
          </select>
          <button className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream">Add</button>
        </form>
      </div>
    </>
  );
}
