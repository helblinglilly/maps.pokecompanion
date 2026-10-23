# Contributing

First of all thanks!

## Tools used

For maps, please edit the Affinity files directly and then use the standard SVG export function. Include both files in your PR.

If you are adding entries to the locations-exclusions list, please leave a justification in the "reason" section - this may help future map makers!

The Web App is intended to be used as a debugging tool - feel free to contribute whatever function you find useful. As it's a debugging tool, it's vibe coded.

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


## Naming

This collection of maps is being built to be used as part of Pokécompanion.
