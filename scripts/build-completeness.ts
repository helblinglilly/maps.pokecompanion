import { exclusionsForVersionGroup, validateLocationExclusions } from '../app/lib/location-exclusions.ts';
import { mkdir, readdir, unlink, readFile, writeFile } from 'node:fs/promises';
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
validateLocationExclusions(regions);
await mkdir(new URL('public/completeness/', root), { recursive: true });
const results = regions.flatMap(region => region.groups.map(group => ({
    region: region.slug, versionGroup: group.slug, file: group.file,
    ...scoreMap(group.ids, region.locations, Boolean(group.file), exclusionsForVersionGroup(region.slug, group.slug)),
})));
const rows = ['| Region | Version group | Map | Completeness |', '| --- | --- | --- | --- |'];
const badgeNames = new Set(results.map(result => `${result.region}-${result.versionGroup}.svg`));
for (const file of await readdir(new URL('public/completeness/', root))) {
  if (file.endsWith('.svg') && !badgeNames.has(file)) {
    await unlink(new URL(`public/completeness/${file}`, root));
  }
}
for (const result of results) {
  const name = `${result.region}-${result.versionGroup}.svg`;
  const message = result.status === 'available' ? `${result.percent}%` : result.status;
  const color = result.status !== 'available' ? '#9f1239' : result.matched === result.total ? '#15803d' : '#a16207';
  await writeFile(new URL(`public/completeness/${name}`, root), badge(result.versionGroup, message, color));
  const map = result.file ? `[${result.file}](assets/${result.file})` : '**Missing map**';
  rows.push(`| ${result.region} | ${result.versionGroup} | ${map} | ![${result.versionGroup} completeness](https://maps.pokecompanion.com/completeness/${name}) |`);
}
await writeFile(new URL('public/completeness/completeness.json', root), `${JSON.stringify(results, null, 2)}\n`);
// README links are stable: regenerate the table only when map coverage changes.
if (process.argv.includes('--update-readme')) {
  const start = '<!-- completeness:start -->';
  const end = '<!-- completeness:end -->';
  const readmePath = new URL('README.md', root);
  const readme = await readFile(readmePath, 'utf8');
  if (!readme.includes(start) || !readme.includes(end)) throw new Error('README completeness markers are missing');
  await writeFile(readmePath, readme.slice(0, readme.indexOf(start) + start.length) + '\n\n' + rows.join('\n') + '\n\n' + readme.slice(readme.indexOf(end)));
}
console.log(`Scored ${results.length} region/version-group pairs. Details: public/completeness/completeness.json`);
