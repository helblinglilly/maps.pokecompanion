# maps.pokecompanion

Schemantic SVG files that map different Pokémon regions, using identifiers that correlate to PokéAPI.

## Assets

Refer to the assets subfolder. The files were created with Affinity Designer 2 and can be modified.

The SVG exports are bundled by the manual **Release maps** workflow.

## App

A demo of the Maps in use can be found at [maps.pokecompanion.com](https://maps.pokecompanion.com)

The viewer UI lives in `app/components/`. `MapRenderer` loads repository-owned
SVG artwork; `MapViewport` handles viewport controls, and `LocationList` compares
SVG identifiers against PokeAPI region locations.

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

## Completeness

CI refreshes these badges from live PokeAPI data on pushes to `main` and daily.
Each game comes from its region's `version_groups` and the group's `versions`.
The score matches the UI: unique matched location IDs / all PokeAPI region
locations. PokeAPI region locations span all games; these are regional coverage
scores for each game's artwork, not a claim that every location exists in that game.
Unknown SVG IDs are reported separately and do not increase the score. Missing maps
score 0%; regions without API locations are marked as such instead of claiming 100%.
See [the detailed report](reports/completeness.json) for missing locations and unknown IDs.
API failures fail CI rather than publishing misleading scores. Low scores are informational.

<!-- completeness:start -->

| Region | Game | Map | Completeness |
| --- | --- | --- | --- |
| kanto | red | [region-1-red-blue-yellow.svg](assets/region-1-red-blue-yellow.svg) | ![red: 50%](reports/badges/kanto-red.svg) |
| kanto | blue | [region-1-red-blue-yellow.svg](assets/region-1-red-blue-yellow.svg) | ![blue: 50%](reports/badges/kanto-blue.svg) |
| kanto | yellow | [region-1-red-blue-yellow.svg](assets/region-1-red-blue-yellow.svg) | ![yellow: 50%](reports/badges/kanto-yellow.svg) |
| kanto | gold | **Missing map** | ![gold: missing map](reports/badges/kanto-gold.svg) |
| kanto | silver | **Missing map** | ![silver: missing map](reports/badges/kanto-silver.svg) |
| kanto | crystal | **Missing map** | ![crystal: missing map](reports/badges/kanto-crystal.svg) |
| kanto | firered | [region-1-firered-leafgreen.svg](assets/region-1-firered-leafgreen.svg) | ![firered: 81.3%](reports/badges/kanto-firered.svg) |
| kanto | leafgreen | [region-1-firered-leafgreen.svg](assets/region-1-firered-leafgreen.svg) | ![leafgreen: 81.3%](reports/badges/kanto-leafgreen.svg) |
| kanto | heartgold | **Missing map** | ![heartgold: missing map](reports/badges/kanto-heartgold.svg) |
| kanto | soulsilver | **Missing map** | ![soulsilver: missing map](reports/badges/kanto-soulsilver.svg) |
| kanto | lets-go-pikachu | **Missing map** | ![lets-go-pikachu: missing map](reports/badges/kanto-lets-go-pikachu.svg) |
| kanto | lets-go-eevee | **Missing map** | ![lets-go-eevee: missing map](reports/badges/kanto-lets-go-eevee.svg) |
| kanto | red-japan | **Missing map** | ![red-japan: missing map](reports/badges/kanto-red-japan.svg) |
| kanto | green-japan | **Missing map** | ![green-japan: missing map](reports/badges/kanto-green-japan.svg) |
| kanto | blue-japan | **Missing map** | ![blue-japan: missing map](reports/badges/kanto-blue-japan.svg) |
| johto | gold | **Missing map** | ![gold: missing map](reports/badges/johto-gold.svg) |
| johto | silver | **Missing map** | ![silver: missing map](reports/badges/johto-silver.svg) |
| johto | crystal | **Missing map** | ![crystal: missing map](reports/badges/johto-crystal.svg) |
| johto | heartgold | **Missing map** | ![heartgold: missing map](reports/badges/johto-heartgold.svg) |
| johto | soulsilver | **Missing map** | ![soulsilver: missing map](reports/badges/johto-soulsilver.svg) |
| hoenn | ruby | **Missing map** | ![ruby: missing map](reports/badges/hoenn-ruby.svg) |
| hoenn | sapphire | **Missing map** | ![sapphire: missing map](reports/badges/hoenn-sapphire.svg) |
| hoenn | emerald | **Missing map** | ![emerald: missing map](reports/badges/hoenn-emerald.svg) |
| hoenn | omega-ruby | **Missing map** | ![omega-ruby: missing map](reports/badges/hoenn-omega-ruby.svg) |
| hoenn | alpha-sapphire | **Missing map** | ![alpha-sapphire: missing map](reports/badges/hoenn-alpha-sapphire.svg) |
| sinnoh | diamond | **Missing map** | ![diamond: missing map](reports/badges/sinnoh-diamond.svg) |
| sinnoh | pearl | **Missing map** | ![pearl: missing map](reports/badges/sinnoh-pearl.svg) |
| sinnoh | platinum | **Missing map** | ![platinum: missing map](reports/badges/sinnoh-platinum.svg) |
| sinnoh | brilliant-diamond | **Missing map** | ![brilliant-diamond: missing map](reports/badges/sinnoh-brilliant-diamond.svg) |
| sinnoh | shining-pearl | **Missing map** | ![shining-pearl: missing map](reports/badges/sinnoh-shining-pearl.svg) |
| unova | black | **Missing map** | ![black: missing map](reports/badges/unova-black.svg) |
| unova | white | **Missing map** | ![white: missing map](reports/badges/unova-white.svg) |
| unova | black-2 | **Missing map** | ![black-2: missing map](reports/badges/unova-black-2.svg) |
| unova | white-2 | **Missing map** | ![white-2: missing map](reports/badges/unova-white-2.svg) |
| kalos | x | **Missing map** | ![x: missing map](reports/badges/kalos-x.svg) |
| kalos | y | **Missing map** | ![y: missing map](reports/badges/kalos-y.svg) |
| alola | sun | **Missing map** | ![sun: missing map](reports/badges/alola-sun.svg) |
| alola | moon | **Missing map** | ![moon: missing map](reports/badges/alola-moon.svg) |
| alola | ultra-sun | **Missing map** | ![ultra-sun: missing map](reports/badges/alola-ultra-sun.svg) |
| alola | ultra-moon | **Missing map** | ![ultra-moon: missing map](reports/badges/alola-ultra-moon.svg) |
| galar | sword | **Missing map** | ![sword: missing map](reports/badges/galar-sword.svg) |
| galar | shield | **Missing map** | ![shield: missing map](reports/badges/galar-shield.svg) |
| galar | the-isle-of-armor-sword | **Missing map** | ![the-isle-of-armor-sword: missing map](reports/badges/galar-the-isle-of-armor-sword.svg) |
| galar | the-isle-of-armor-shield | **Missing map** | ![the-isle-of-armor-shield: missing map](reports/badges/galar-the-isle-of-armor-shield.svg) |
| galar | the-crown-tundra-sword | **Missing map** | ![the-crown-tundra-sword: missing map](reports/badges/galar-the-crown-tundra-sword.svg) |
| galar | the-crown-tundra-shield | **Missing map** | ![the-crown-tundra-shield: missing map](reports/badges/galar-the-crown-tundra-shield.svg) |
| hisui | legends-arceus | **Missing map** | ![legends-arceus: missing map](reports/badges/hisui-legends-arceus.svg) |
| paldea | scarlet | **Missing map** | ![scarlet: missing map](reports/badges/paldea-scarlet.svg) |
| paldea | violet | **Missing map** | ![violet: missing map](reports/badges/paldea-violet.svg) |
| paldea | the-teal-mask-scarlet | **Missing map** | ![the-teal-mask-scarlet: missing map](reports/badges/paldea-the-teal-mask-scarlet.svg) |
| paldea | the-teal-mask-violet | **Missing map** | ![the-teal-mask-violet: missing map](reports/badges/paldea-the-teal-mask-violet.svg) |
| paldea | the-indigo-disk-scarlet | **Missing map** | ![the-indigo-disk-scarlet: missing map](reports/badges/paldea-the-indigo-disk-scarlet.svg) |
| paldea | the-indigo-disk-violet | **Missing map** | ![the-indigo-disk-violet: missing map](reports/badges/paldea-the-indigo-disk-violet.svg) |

<!-- completeness:end -->

## CI and deployment

Pull requests and pushes to `main` run tests, type checking, a production build,
and `npm run maps:completeness`. CI uploads the report and badges as artifacts.
On `main`, the bot commits updated badges, report, and this README with `[skip ci]`.
The repository must allow GitHub Actions write access to contents; branch rules
must allow the bot's report commits. The daily run also detects PokeAPI changes.

Every push to `main` that passes CI deploys the built app using Wrangler and the
`production` environment's `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` secrets.
`wrangler.jsonc` defines the Worker and custom domain; the Vite plugin generates
its deployment config during the build.

To publish assets, edit `RELEASE_NOTES.md`, commit it, then run **Release maps**
in GitHub Actions on `main` with a new version tag (for example `v1.0.0`). The job
validates the maps, bundles only SVG exports, release notes, and the completeness
report into a ZIP, then creates a GitHub Release at that exact commit using the
markdown file as its release body. Affinity source files are excluded.
