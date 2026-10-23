import { mkdir, readdir, readFile, copyFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const tag = process.env.RELEASE_TAG;
if (!tag || !/^v?[0-9]+\.[0-9]+\.[0-9]+(?:-[A-Za-z0-9.-]+)?$/.test(tag)) {
  throw new Error('RELEASE_TAG must be a version such as v1.0.0 or v1.0.0-beta.1');
}
const notes = await readFile(new URL('RELEASE_NOTES.md', root), 'utf8');
if (!notes.trim()) throw new Error('RELEASE_NOTES.md must not be empty');
await rm(new URL('dist/release/', root), { recursive: true, force: true });
await rm(new URL(`dist/maps-${tag}.zip`, root), { force: true });
const staging = new URL('dist/release/maps/', root);
await mkdir(staging, { recursive: true });
const files = (await readdir(new URL('assets/', root))).filter(file => file.endsWith('.svg')).sort();
if (!files.length) throw new Error('No SVG maps to release');
for (const file of files) await copyFile(new URL(`assets/${file}`, root), new URL(file, staging));
await copyFile(new URL('reports/completeness.json', root), new URL('dist/release/completeness.json', root));
await copyFile(new URL('RELEASE_NOTES.md', root), new URL('dist/release/RELEASE_NOTES.md', root));
// zip is provided by the GitHub-hosted Ubuntu runner; keep orchestration in TypeScript.
execFileSync('zip', ['-r', `../maps-${tag}.zip`, 'maps', 'completeness.json', 'RELEASE_NOTES.md'], { cwd: new URL('dist/release/', root), stdio: 'inherit' });
