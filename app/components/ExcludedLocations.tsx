import { type LocationExclusion } from "../lib/location-exclusions";
import type { RegionLocation } from "../lib/map-validation";

export function ExcludedLocations({
  locations,
  versionGroupName,
}: {
  locations: (LocationExclusion & RegionLocation)[];
  versionGroupName: string;
}) {
  if (!locations.length) return null;
  return (
    <section
      aria-labelledby="excluded-locations-heading"
      className="mt-6 border-t border-[#d7dfd5] pt-4"
    >
      <h2 id="excluded-locations-heading" className="font-semibold">
        Excluded locations ({locations.length})
      </h2>
      <p className="mt-2 text-xs">Not counted toward completeness for Pokémon {versionGroupName}.</p>
      <ul className="mt-3 space-y-3 text-sm">
        {locations.map((location) => (
          <li key={location.name}>
            <a href={location.url} className="wrap-break-word text-amber-800 underline">
              {location.name}
            </a>
            <p className="mt-1 text-xs text-[#52665e]">{location.reason}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
