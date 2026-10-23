import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { scoreMap, badge } from './map-completeness.ts';
import type { RegionLocation } from '../app/lib/map-validation.ts';

interface Region {
  slug: string;
  name: string;
  locations: RegionLocation[];
  groups: { slug: string; file: string | null; ids: string[] }[];
}
const root = new URL('../', import.meta.url);
const regions: Region[] = JSON.parse(await readFile(new URL('app/lib/map-catalog.json', root), 'utf8'));
const groups = new Map<string, string[]>();
// Fetch each version group once, even if it appears in multiple regions.
for (const slug of new Set(regions.flatMap(region => region.groups.map(group => group.slug)))) {
  const response = await fetch(`https://pokeapi.co/api/v2/version-group/${slug}/`, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`PokeAPI ${response.status}: version-group/${slug}`);
  const data = await response.json() as { versions: { name: string }[] };
  if (!data.versions.length) throw new Error(`PokeAPI version-group/${slug} has no games`);
  groups.set(slug, data.versions.map(version => version.name));
}
await mkdir(new URL('reports/badges/', root), { recursive: true });
const results = regions.flatMap(region => region.groups.flatMap(group => {
  const score = scoreMap(group.ids, region.locations, Boolean(group.file));
  return groups.get(group.slug)!.map(game => ({ region: region.slug, game, versionGroup: group.slug, file: group.file, ...score }));
}));
const rows = ['| Region | Game | Map | Completeness |', '| --- | --- | --- | --- |'];
for (const result of results) {
  const name = `${result.region}-${result.game}.svg`;
  const message = result.status === 'available' ? `${result.percent}%` : result.status;
  const color = result.status !== 'available' ? '#9f1239' : result.matched === result.total ? '#15803d' : '#a16207';
  await writeFile(new URL(`reports/badges/${name}`, root), badge(result.game, message, color));
  const map = result.file ? `[${result.file}](assets/${result.file})` : '**Missing map**';
  rows.push(`| ${result.region} | ${result.game} | ${map} | ![${result.game}: ${message}](reports/badges/${name}) |`);
}
await writeFile(new URL('reports/completeness.json', root), `${JSON.stringify(results, null, 2)}\n`);
const start = '<!-- completeness:start -->';
const end = '<!-- completeness:end -->';
const readmePath = new URL('README.md', root);
const readme = await readFile(readmePath, 'utf8');
if (!readme.includes(start) || !readme.includes(end)) throw new Error('README completeness markers are missing');
await writeFile(readmePath, readme.slice(0, readme.indexOf(start) + start.length) + '\n\n' + rows.join('\n') + '\n\n' + readme.slice(readme.indexOf(end)));
console.log(`Scored ${results.length} region/game pairs. Details: reports/completeness.json`);
