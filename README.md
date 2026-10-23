# maps.pokecompanion

Schemantic SVG files that map different Pokémon regions, using identifiers that correlate to PokéAPI.

## Assets

Refer to the assets subfolder. The files were created with Affinity Designer 2 and can be modified.

The SVGs are their outputs (to be moved to CD and nicely bundled up).

## App

A demo of the Maps in use can be found at [maps.pokecompanion.com](https://maps.pokecompanion.com)

The viewer UI lives in `app/components/atlas/`. `MapExplorer` composes the map
picker, location list, highlight controls, map canvas, zoom controls, and page
chrome. `app/hooks/use-map-viewer.ts` owns SVG loading, selection, and viewport
interactions; `app/lib/maps.ts` holds map definitions and shared labels.

## Tests

Run `npm test` for a single test run, or `npm run test:watch` during development.
You can target a file with `npm test -- app/components/atlas/zoom-controls.test.tsx`.

Tests use Vitest with jsdom and React Testing Library. Place tests beside the code
as `*.test.ts` or `*.test.tsx`, and import test APIs from `vitest`. DOM matchers
and automatic cleanup are configured in `tests/setup.ts`. The separate
`vitest.config.ts` supports the `@/` alias and keeps unit tests independent of
the Vinext and Cloudflare runtime plugins.

## Map catalog

The scripts in `scripts/` use TypeScript and run directly with Node.js 22.18+
(or Node.js 24+) using its built-in type stripping.

`npm run dev` and `npm run build` sync the SVG assets into `public/maps`, then
fetch PokeAPI regions to generate `app/lib/map-catalog.json`. These commands
require access to PokeAPI; pages use the generated catalog without runtime API calls.

PokeAPI's region `version_groups` field defines every region's version groups,
including groups with no local artwork. `app/lib/map-assets.ts` explicitly assigns
local SVG files to those API groups; filenames do not determine availability.
For example, the same Kanto SVG is assigned to both `red-blue` and `yellow`.
Catalog generation rejects assignments to unknown API regions or groups and
missing SVG files. The homepage labels groups without an assignment as missing maps.
Available maps use static `/{region}/{versionGroup}` routes.
Combined filename URLs (such as `/kanto/red-blue-yellow`) are automatically
redirected to the first matching version group. The same predev/prebuild script
generates `app/lib/map-redirects.json`, which `next.config.ts` loads; no regional
route folders need to be maintained.
