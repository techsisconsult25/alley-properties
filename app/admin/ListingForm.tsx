import Image from 'next/image';
import type { Category, Listing } from '@/lib/types';
import { SPEC_LABELS } from '@/lib/utils';
import { deleteImage } from './actions';

type Props = {
  categories: Category[];
  listing?: Listing;
  action: (fd: FormData) => Promise<void>;
};

const PROPERTY_SPECS = ['bedrooms', 'bathrooms', 'area', 'title', 'stay'];
const FURNISHING_SPECS = ['material', 'dimensions', 'color'];

export default function ListingForm({ categories, listing, action }: Props) {
  const s = listing?.specs ?? {};
  const images = [...(listing?.listing_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return (
    <div className="space-y-8">
      <form
        action={action}
        className="grid gap-5 rounded-2xl bg-white p-6 ring-1 ring-black/5 md:grid-cols-2"
      >
        <Field label="Title" className="md:col-span-2">
          <input
            name="title"
            required
            defaultValue={listing?.title}
            className="input"
          />
        </Field>
        <Field label="Category">
          <select
            name="category_id"
            required
            defaultValue={listing?.category_id}
            className="input"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location">
          <input
            name="location"
            defaultValue={listing?.location ?? ''}
            className="input"
            placeholder="Lekki Phase 1, Uyo"
          />
        </Field>
        <Field label="Price (₦)">
          <input
            name="price"
            type="number"
            min="0"
            required
            defaultValue={listing?.price}
            className="input"
          />
        </Field>
        <Field label="Price suffix (optional)">
          <input
            name="price_suffix"
            defaultValue={listing?.price_suffix ?? ''}
            className="input"
            placeholder="/ night, / year"
          />
        </Field>
        <Field label="Status">
          <select
            name="status"
            defaultValue={listing?.status ?? 'available'}
            className="input"
          >
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 self-end pb-3 text-sm font-medium">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={listing?.featured}
            className="h-4 w-4"
          />{' '}
          Feature on home page
        </label>

        <fieldset className="md:col-span-2">
          <legend className="mb-2 text-sm font-semibold">
            Property details{' '}
            <span className="font-normal text-muted">
              (houses &amp; apartments)
            </span>
          </legend>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {PROPERTY_SPECS.map((k) => (
              <Field key={k} label={SPEC_LABELS[k]}>
                <input
                  name={`spec_${k}`}
                  defaultValue={s[k] as string}
                  className="input"
                />
              </Field>
            ))}
          </div>
        </fieldset>
        <fieldset className="md:col-span-2">
          <legend className="mb-2 text-sm font-semibold">
            Furnishing details
          </legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {FURNISHING_SPECS.map((k) => (
              <Field key={k} label={SPEC_LABELS[k]}>
                <input
                  name={`spec_${k}`}
                  defaultValue={s[k] as string}
                  className="input"
                />
              </Field>
            ))}
          </div>
        </fieldset>

        <Field label="Description" className="md:col-span-2">
          <textarea
            name="description"
            rows={5}
            defaultValue={listing?.description ?? ''}
            className="input"
          />
        </Field>
        <Field
          label={listing ? 'Add more photos' : 'Photos'}
          className="md:col-span-2"
        >
          <input
            name="images"
            type="file"
            accept="image/*"
            multiple
            className="input"
          />
        </Field>
        <div className="md:col-span-2">
          <button className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream">
            {listing ? 'Save changes' : 'Publish listing'}
          </button>
        </div>
      </form>

      {images.length > 0 && (
        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <h2 className="text-xl">Current photos</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative aspect-[4/3] overflow-hidden rounded-xl"
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                <form
                  action={deleteImage.bind(null, img.id)}
                  className="absolute right-2 top-2"
                >
                  <button className="rounded-full bg-white/90 px-2 py-1 text-xs text-sold">
                    Remove
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
