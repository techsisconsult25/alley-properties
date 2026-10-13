import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-32 text-center">
      <h1 className="text-6xl">Not found</h1>
      <p className="mt-4 text-muted">That page or listing doesn&apos;t exist anymore.</p>
      <Link href="/" className="mt-8 inline-block font-semibold text-brass">Back to the showroom →</Link>
    </div>
  );
}
