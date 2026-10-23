import { MapStyleWorkspace } from "../../components/MapStyleEditor";
import { notFound } from "vinext/shims/navigation";
import regions from "../../lib/map-catalog.json";
import { LocationList } from "../../components/LocationList";
import { MapRenderer } from "../../components/MapRenderer";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return regions.flatMap((region) =>
    region.groups
      .filter((group) => group.file)
      .map((group) => ({
        region: region.slug,
        versionGroup: group.slug,
      })),
  );
}

export default async function RegionMap({
  params,
}: {
  params: Promise<{ region: string; versionGroup: string }>;
}) {
  const { region: slug, versionGroup } = await params;
  const region = regions.find((region) => region.slug === slug);
  const group = region?.groups.find((group) => group.slug === versionGroup);
  if (!region || !group?.file) notFound();

  return (
    <MapStyleWorkspace sidebar={<LocationList regionName={region.name} ids={group.ids} locations={region.locations} />}>
        <MapRenderer
          src={`/maps/${group.file}`}
          label={`${region.name} map for Pokémon ${group.name}`}
        />
    </MapStyleWorkspace>
  );
}
