"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const ctx = await getAdmin();
  if (!ctx.user) redirect("/admin/login");
  if (!ctx.isAdmin) throw new Error("Not authorised");
  return ctx.supabase;
}

type DB = Awaited<ReturnType<typeof requireAdmin>>;

const SPEC_KEYS = ["bedrooms", "bathrooms", "area", "title", "stay", "material", "dimensions", "color"];

function readListing(fd: FormData) {
  const specs: Record<string, string> = {};
  for (const k of SPEC_KEYS) {
    const v = String(fd.get(`spec_${k}`) ?? "").trim();
    if (v) specs[k] = v;
  }
  return {
    title: String(fd.get("title") ?? "").trim(),
    category_id: String(fd.get("category_id")),
    price: Number(fd.get("price") || 0),
    price_suffix: String(fd.get("price_suffix") ?? "").trim() || null,
    location: String(fd.get("location") ?? "").trim() || null,
    status: fd.get("status") === "sold" ? "sold" : "available",
    featured: fd.get("featured") === "on",
    description: String(fd.get("description") ?? "").trim() || null,
    specs,
  };
}

async function uploadImages(supabase: DB, listingId: string, fd: FormData, startAt: number) {
  const files = fd.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  let order = startAt;
  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${listingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("listing-images").upload(path, file, { contentType: file.type });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
    await supabase.from("listing_images").insert({ listing_id: listingId, url: data.publicUrl, storage_path: path, sort_order: order++ });
  }
}

function refresh() {
  revalidatePath("/", "layout");
}

export async function createListing(fd: FormData) {
  const supabase = await requireAdmin();
  const data = readListing(fd);
  if (!data.title) throw new Error("Title is required");
  const slug = `${slugify(data.title)}-${Math.random().toString(36).slice(2, 6)}`;
  const { data: row, error } = await supabase.from("listings").insert({ ...data, slug }).select("id").single();
  if (error) throw new Error(error.message);
  await uploadImages(supabase, row.id, fd, 0);
  refresh();
  redirect("/admin");
}

export async function updateListing(id: string, fd: FormData) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("listings").update(readListing(fd)).eq("id", id);
  if (error) throw new Error(error.message);
  const { count } = await supabase.from("listing_images").select("id", { count: "exact", head: true }).eq("listing_id", id);
  await uploadImages(supabase, id, fd, count ?? 0);
  refresh();
  redirect("/admin");
}

export async function deleteListing(id: string) {
  const supabase = await requireAdmin();
  const { data: imgs } = await supabase.from("listing_images").select("storage_path").eq("listing_id", id);
  const paths = (imgs ?? []).map((i) => i.storage_path).filter(Boolean) as string[];
  if (paths.length) await supabase.storage.from("listing-images").remove(paths);
  await supabase.from("listings").delete().eq("id", id);
  refresh();
}

export async function setStatus(id: string, status: "available" | "sold") {
  const supabase = await requireAdmin();
  await supabase.from("listings").update({ status }).eq("id", id);
  refresh();
}

export async function deleteImage(imageId: string) {
  const supabase = await requireAdmin();
  const { data } = await supabase.from("listing_images").select("storage_path").eq("id", imageId).single();
  if (data?.storage_path) await supabase.storage.from("listing-images").remove([data.storage_path]);
  await supabase.from("listing_images").delete().eq("id", imageId);
  refresh();
}

export async function addCategory(fd: FormData) {
  const supabase = await requireAdmin();
  const name = String(fd.get("name") ?? "").trim();
  if (!name) return;
  await supabase.from("categories").insert({
    name,
    slug: slugify(name),
    tagline: String(fd.get("tagline") ?? "").trim() || null,
    kind: fd.get("kind") === "furnishing" ? "furnishing" : "property",
    sort_order: 99,
  });
  refresh();
}

export async function deleteCategory(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error("Remove or move this category's listings first.");
  refresh();
}

export async function signOut() {
  const ctx = await getAdmin();
  await ctx.supabase.auth.signOut();
  redirect("/admin/login");
}
