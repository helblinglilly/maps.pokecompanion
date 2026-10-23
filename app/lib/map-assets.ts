/** Local artwork assignments; PokeAPI defines which region/group pairs exist. */
export const mapAssets: Record<number, Record<string, string>> = {
  1: {
    "red-blue": "region-1-red-blue-yellow.svg",
    yellow: "region-1-red-blue-yellow.svg",
    "firered-leafgreen": "region-1-firered-leafgreen.svg",
  },
  5: {
    "black-white": "region-5-black-white.svg",
    "black-2-white-2": "region-5-black-2-white-2.svg",
  },
  6: {
    "x-y": "region-6-x-y.svg",
  },
};

export interface CatalogRegion {
  id: number;
  version_groups: { name: string }[];
}

/** Reject stale assignments instead of inventing groups from local artwork. */
export function validateMapAssets(
  regions: CatalogRegion[],
  files: string[],
  assets: Record<number, Record<string, string>> = mapAssets,
) {
  for (const [regionId, groups] of Object.entries(assets)) {
    const region = regions.find((region) => region.id === Number(regionId));
    if (!region) throw new Error(`Map assignment references unknown PokeAPI region ${regionId}`);
    for (const [group, file] of Object.entries(groups)) {
      if (!region.version_groups.some((resource) => resource.name === group)) {
        throw new Error(
          `Map assignment references unknown PokeAPI version group ${regionId}/${group}`,
        );
      }
      if (!files.includes(file)) throw new Error(`Map assignment references missing SVG ${file}`);
    }
  }
}
