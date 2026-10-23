import { readFile, readdir, writeFile } from 'node:fs/promises';
import { extractSvgIds } from '../app/lib/map-validation.ts';
import { mapAssets, validateMapAssets } from '../app/lib/map-assets.ts';

const api = 'https://pokeapi.co/api/v2/';
interface NamedResource {
  name: string;
  url: string;
}

interface ResourcePage {
  results: NamedResource[];
  next: string | null;
}

interface Region {
  id: number;
  name: string;
  names: { name: string; language: NamedResource }[];
  version_groups: NamedResource[];
  locations: NamedResource[];
}

interface MapRedirect {
  source: string;
  destination: string;
  permanent: boolean;
}

async function get<T>(url: string): Promise<T> {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`PokeAPI ${response.status}: ${url}`);
  return response.json();
}
const files = (await readdir(new URL('../public/maps/', import.meta.url))).sort();
const mapIds = new Map(await Promise.all(files.filter(file => file.endsWith('.svg')).map(async file => [
  file,
  extractSvgIds(await readFile(new URL(`../public/maps/${file}`, import.meta.url), 'utf8')),
] as const)));
const regions: Region[] = [];
let next: string | null = `${api}region/`;
while (next) {
  const page: ResourcePage = await get<ResourcePage>(next);
  regions.push(...await Promise.all(page.results.map(({ url }) => get<Region>(url))));
  next = page.next;
}
validateMapAssets(regions, files);
const title = (name: string) => name.replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
const catalog = regions.sort((a, b) => a.id - b.id).map(region => ({
  id: region.id,
  slug: region.name,
  name: region.names.find(item => item.language.name === 'en')?.name ?? title(region.name),
  locations: region.locations,
  groups: region.version_groups.map(group => {
    const file = mapAssets[region.id]?.[group.name] ?? null;
    return {
      slug: group.name,
      name: group.name.split('-').map(title).join(' / '),
      file,
      ids: file ? mapIds.get(file) ?? [] : [],
    };
  }),
}));
await writeFile(new URL('../app/lib/map-catalog.json', import.meta.url), `${JSON.stringify(catalog, null, 2)}\n`);

// Combined filenames can cover several API version groups. Keep their URLs as
// aliases of the first matching group, without generating region route folders.
const redirects: MapRedirect[] = [];
for (const region of catalog) {
  for (const file of files) {
    const match = /^region-(\d+)-(.+)\.svg$/.exec(file);
    if (!match || Number(match[1]) !== region.id) continue;
    const alias = match[2];
    if (region.groups.some(group => group.slug === alias)) continue;
    const target = region.groups.find(group => group.file === file);
    if (!target) continue;
    redirects.push({
      source: `/${region.slug}/${alias}`,
      destination: `/${region.slug}/${target.slug}`,
      permanent: true,
    });
  }
}
await writeFile(new URL('../app/lib/map-redirects.json', import.meta.url), `${JSON.stringify(redirects, null, 2)}\n`);
