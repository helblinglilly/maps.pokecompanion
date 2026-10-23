import { exclusionsForVersionGroup } from "../lib/location-exclusions";
import { validateMapIds, type RegionLocation } from "../lib/map-validation";

export function MapCompleteness({ regionSlug, group, locations }: {
  regionSlug: string;
  group: { slug: string; file: string | null; ids: string[] };
  locations: RegionLocation[];
}) {
  const { matched, total, percent } = validateMapIds(
    group.file ? group.ids : [],
    locations,
    exclusionsForVersionGroup(regionSlug, group.slug),
  );
  const description = !group.file
    ? "Missing map"
    : !total ? "No applicable locations" : `${matched} of ${total} locations mapped`;

  return (
    <span
      className="text-sm opacity-70"
      title={description}
      aria-label={`${percent}% complete: ${description}`}
    >
      {percent}% complete
    </span>
  );
}
