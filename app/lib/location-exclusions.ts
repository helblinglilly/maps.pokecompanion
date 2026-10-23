import rules from "../../config/location-exclusions.json" with { type: "json" };

export interface LocationExclusion {
  region: string;
  location: string[];
  versionGroups: string[];
  reason: string;
  reappearsIn?: string[];
}

export const locationExclusions: LocationExclusion[] = rules;

export function exclusionsForVersionGroup(region: string, versionGroup: string) {
  return locationExclusions.filter((rule) => rule.region === region && rule.versionGroups.includes(versionGroup));
}

interface AvailabilityRegion {
  slug: string;
  locations: { name: string }[];
  groups: { slug: string }[];
}

/** Fail builds on typos or stale API references instead of silently ignoring rules. */
export function validateLocationExclusions(
  regions: AvailabilityRegion[],
  exclusions: LocationExclusion[] = locationExclusions,
) {
  const seen = new Set<string>();
  for (const rule of exclusions) {
    const region = regions.find((region) => region.slug === rule.region);
    if (!region) throw new Error(`Exclusion references unknown PokeAPI region: ${rule.region}`);
    if (!Array.isArray(rule.location) || !rule.location.length) {
      throw new Error('Exclusion needs a non-empty location array');
    }
    for (const name of rule.location) {
      if (!region.locations.some((location) => location.name === name)) {
        throw new Error(
          `Exclusion references unknown PokeAPI location: ${rule.region}/${name}`,
        );
      }
    }
    if (
      typeof rule.reason !== "string" ||
      !rule.reason.trim() ||
      !Array.isArray(rule.versionGroups) ||
      !rule.versionGroups.length ||
      (rule.reappearsIn !== undefined && !Array.isArray(rule.reappearsIn))
    ) {
      throw new Error(
        `Exclusion needs versionGroups, a reason and optionally a reappearsIn array: ${rule.region}/${rule.location}`,
      );
    }
    const versionGroups = new Set(region.groups.map((group) => group.slug));
    for (const versionGroup of [...rule.versionGroups, ...(rule.reappearsIn ?? [])]) {
      if (!versionGroups.has(versionGroup))
        throw new Error(`Exclusion references unknown PokeAPI region/versionGroup: ${rule.region}/${versionGroup}`);
    }
    for (const name of rule.location) {
      for (const versionGroup of rule.versionGroups) {
        const key = `${rule.region}/${name}/${versionGroup}`;
        if (seen.has(key)) throw new Error(`Duplicate location exclusion: ${key}`);
        if (rule.reappearsIn?.includes(versionGroup))
          throw new Error(`Excluded versionGroup also listed in reappearsIn: ${key}`);
        seen.add(key);
      }
    }
  }
  // A location cannot reappear in a versionGroup where another rule excludes it.
  for (const rule of exclusions) {
    for (const name of rule.location) {
      for (const versionGroup of rule.reappearsIn ?? []) {
        if (seen.has(`${rule.region}/${name}/${versionGroup}`)) {
          throw new Error(
            `Reappearance conflicts with exclusion: ${rule.region}/${name}/${versionGroup}`,
          );
        }
      }
    }
  }
}
