export type Category = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  kind: "property" | "furnishing";
  sort_order: number;
};

export type ListingImage = { id: string; url: string; storage_path: string | null; sort_order: number };

export type Listing = {
  id: string;
  slug: string;
  title: string;
  category_id: string;
  price: number;
  price_suffix: string | null;
  location: string | null;
  status: "available" | "sold";
  featured: boolean;
  description: string | null;
  specs: Record<string, string | number>;
  created_at: string;
  categories?: Pick<Category, "slug" | "name" | "kind"> | null;
  listing_images?: ListingImage[];
};

export const LISTING_SELECT = "*, categories(slug,name,kind), listing_images(id,url,storage_path,sort_order)";
