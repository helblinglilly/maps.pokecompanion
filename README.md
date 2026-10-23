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
The score matches the UI: unique matched applicable location IDs / applicable
PokeAPI region locations. Both the web app and CI apply
[`config/location-exclusions.json`](config/location-exclusions.json) to remove
locations absent from the selected game. Unknown SVG IDs are reported separately
and do not increase the score. Missing maps score 0%; games with no applicable
locations are marked as such instead of claiming 100%.
See [the detailed report](https://maps.pokecompanion.com/completeness/completeness.json) for missing locations and unknown IDs.
API failures fail CI rather than publishing misleading scores. Low scores are informational.

<!-- completeness:start -->

| Region | Version group | Map | Completeness |
| --- | --- | --- | --- |
| kanto | red-blue | [region-1-red-blue-yellow.svg](assets/region-1-red-blue-yellow.svg) | ![red-blue completeness](https://maps.pokecompanion.com/completeness/kanto-red-blue.svg) |
| kanto | yellow | [region-1-red-blue-yellow.svg](assets/region-1-red-blue-yellow.svg) | ![yellow completeness](https://maps.pokecompanion.com/completeness/kanto-yellow.svg) |
| kanto | gold-silver | **Missing map** | ![gold-silver completeness](https://maps.pokecompanion.com/completeness/kanto-gold-silver.svg) |
| kanto | crystal | **Missing map** | ![crystal completeness](https://maps.pokecompanion.com/completeness/kanto-crystal.svg) |
| kanto | firered-leafgreen | [region-1-firered-leafgreen.svg](assets/region-1-firered-leafgreen.svg) | ![firered-leafgreen completeness](https://maps.pokecompanion.com/completeness/kanto-firered-leafgreen.svg) |
| kanto | heartgold-soulsilver | **Missing map** | ![heartgold-soulsilver completeness](https://maps.pokecompanion.com/completeness/kanto-heartgold-soulsilver.svg) |
| kanto | lets-go-pikachu-lets-go-eevee | **Missing map** | ![lets-go-pikachu-lets-go-eevee completeness](https://maps.pokecompanion.com/completeness/kanto-lets-go-pikachu-lets-go-eevee.svg) |
| johto | gold-silver | **Missing map** | ![gold-silver completeness](https://maps.pokecompanion.com/completeness/johto-gold-silver.svg) |
| johto | crystal | **Missing map** | ![crystal completeness](https://maps.pokecompanion.com/completeness/johto-crystal.svg) |
| johto | heartgold-soulsilver | **Missing map** | ![heartgold-soulsilver completeness](https://maps.pokecompanion.com/completeness/johto-heartgold-soulsilver.svg) |
| hoenn | ruby-sapphire | **Missing map** | ![ruby-sapphire completeness](https://maps.pokecompanion.com/completeness/hoenn-ruby-sapphire.svg) |
| hoenn | emerald | **Missing map** | ![emerald completeness](https://maps.pokecompanion.com/completeness/hoenn-emerald.svg) |
| hoenn | omega-ruby-alpha-sapphire | **Missing map** | ![omega-ruby-alpha-sapphire completeness](https://maps.pokecompanion.com/completeness/hoenn-omega-ruby-alpha-sapphire.svg) |
| sinnoh | diamond-pearl | **Missing map** | ![diamond-pearl completeness](https://maps.pokecompanion.com/completeness/sinnoh-diamond-pearl.svg) |
| sinnoh | platinum | **Missing map** | ![platinum completeness](https://maps.pokecompanion.com/completeness/sinnoh-platinum.svg) |
| sinnoh | brilliant-diamond-shining-pearl | **Missing map** | ![brilliant-diamond-shining-pearl completeness](https://maps.pokecompanion.com/completeness/sinnoh-brilliant-diamond-shining-pearl.svg) |
| unova | black-white | **Missing map** | ![black-white completeness](https://maps.pokecompanion.com/completeness/unova-black-white.svg) |
| unova | black-2-white-2 | **Missing map** | ![black-2-white-2 completeness](https://maps.pokecompanion.com/completeness/unova-black-2-white-2.svg) |
| kalos | x-y | **Missing map** | ![x-y completeness](https://maps.pokecompanion.com/completeness/kalos-x-y.svg) |
| alola | sun-moon | **Missing map** | ![sun-moon completeness](https://maps.pokecompanion.com/completeness/alola-sun-moon.svg) |
| alola | ultra-sun-ultra-moon | **Missing map** | ![ultra-sun-ultra-moon completeness](https://maps.pokecompanion.com/completeness/alola-ultra-sun-ultra-moon.svg) |
| galar | sword-shield | **Missing map** | ![sword-shield completeness](https://maps.pokecompanion.com/completeness/galar-sword-shield.svg) |
| galar | the-isle-of-armor | **Missing map** | ![the-isle-of-armor completeness](https://maps.pokecompanion.com/completeness/galar-the-isle-of-armor.svg) |
| galar | the-crown-tundra | **Missing map** | ![the-crown-tundra completeness](https://maps.pokecompanion.com/completeness/galar-the-crown-tundra.svg) |
| hisui | legends-arceus | **Missing map** | ![legends-arceus completeness](https://maps.pokecompanion.com/completeness/hisui-legends-arceus.svg) |
| paldea | scarlet-violet | **Missing map** | ![scarlet-violet completeness](https://maps.pokecompanion.com/completeness/paldea-scarlet-violet.svg) |
| paldea | the-teal-mask | **Missing map** | ![the-teal-mask completeness](https://maps.pokecompanion.com/completeness/paldea-the-teal-mask.svg) |
| paldea | the-indigo-disk | **Missing map** | ![the-indigo-disk completeness](https://maps.pokecompanion.com/completeness/paldea-the-indigo-disk.svg) |

<!-- completeness:end -->

## Game-specific location exclusions

Edit `config/location-exclusions.json` using PokeAPI region, location, and individual
version names (such as `red`, not the version group `red-blue`). Each entry has:

```json
{
  "region": "kanto",
  "location": "one-island",
  "games": ["red", "blue", "yellow"],
  "reason": "One Island is part of the Sevii Islands, introduced in FireRed and LeafGreen.",
  "reappearsIn": ["firered", "leafgreen"]
}
```

The file starts with One Island as an example, based on its
[Sevii Islands game appearances](https://bulbapedia.bulbagarden.net/wiki/Sevii_Islands);
it is not a complete list of game differences. Add further exclusions explicitly.
PokeAPI remains the source of location identities and region/game availability.
Builds reject unknown regions, locations or games, empty reasons or game lists,
duplicate rules for a location/game, and conflicting reappearance games.
`reappearsIn` lists games where the location appears or returns; it does not
implicitly exclude any other games.

Map pages offer a game selector within their version group. Excluded locations
are listed at the bottom with their reason and reappearance games, even when
already drawn in the SVG. They are omitted from both matched and total counts
and from the missing list. The CI JSON report includes the same exclusions and
explanations per game. All other PokeAPI locations remain required by default.

## CI and deployment

Pull requests and pushes to `main` run tests, type checking, a production build,
and `npm run maps:completeness`. CI uploads the report and badges as artifacts.
Badges and the JSON report are generated into ignored `public/completeness/` files
on every app build, then served at `https://maps.pokecompanion.com/completeness/`.
The README uses stable hosted URLs; no bot commits or repository write permission
are needed. Run `npm run maps:readme` and commit the README when adding regions
or version groups to refresh its table.

Every push to `main` that passes CI deploys the built app using Wrangler and the
`production` environment's `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` secrets.
Daily scheduled runs and manual runs on `main` also deploy so hosted badges stay
current with PokeAPI changes. Pull requests validate and upload artifacts only.
`wrangler.jsonc` defines the Worker and custom domain; the Vite plugin generates
its deployment config during the build.

To publish assets, edit `RELEASE_NOTES.md`, commit it, then run **Release maps**
in GitHub Actions on `main` with a new version tag (for example `v1.0.0`). The job
validates the maps, bundles only SVG exports, release notes, and the completeness
report into a ZIP, then creates a GitHub Release at that exact commit using the
markdown file as its release body. Affinity source files are excluded.
