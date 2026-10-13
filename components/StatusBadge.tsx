export default function StatusBadge({ status }: { status: "available" | "sold" }) {
  return status === "sold" ? (
    <span className="rounded-full bg-sold px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">Sold</span>
  ) : (
    <span className="rounded-full bg-forest px-3 py-1 text-xs font-bold uppercase tracking-wider text-cream">Available</span>
  );
}
