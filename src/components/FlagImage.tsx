import { flagUrl } from "@/lib/flag";

export default function FlagImage({ slug, name, className = "w-6 h-6 inline-block rounded-sm" }: { slug: string; name: string; className?: string }) {
  return (
    <img
      src={flagUrl(slug)}
      alt={`${name} flag`}
      title={`Flag of ${name}`}
      className={className}
      loading="lazy"
    />
  );
}
