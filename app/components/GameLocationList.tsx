import type { RegionLocation } from '../lib/map-validation';
import { LocationList } from './LocationList';

export function GameLocationList({ regionSlug, regionName, group, ids, locations }: {
  regionSlug: string;
  regionName: string;
  group: { slug: string; name: string };
  ids: string[];
  locations: RegionLocation[];
}) {
  return <LocationList regionSlug={regionSlug} regionName={regionName} versionGroup={group.slug} versionGroupName={group.name} ids={ids} locations={locations} />;
}
