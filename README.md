# maps.pokecompanion

PokéAPI compatible regional Pokémon Maps.

## Compatibility

Each SVG element has a ID that correlates to its resource name in PokéAPI.

The same region may appear in different games - a different map exists for each game. This means that no one map may offer 100% compatibility with PokéAPI. Please refer to `locations-exclusions.json` for more info about each location.

### Usage

Download the respective assets - see completeness table for links.

Once regions have reached 100% completeness, they will become available to download via the Releases tab

A demo of the Maps in use can be found at [maps.pokecompanion.com](https://maps.pokecompanion.com)


## Contributions

This project is looking for supporters. Please refer to the completion chart and Contributing.md

## Status

CI refreshes these badges from live PokeAPI data on pushes to `main` and daily.
Each game comes from its region's `version_groups` and the group's `versions`.
The score matches the UI: unique matched applicable location IDs / applicable
PokeAPI region locations. Both the web app and CI apply
[`config/location-exclusions.jsonc`](config/location-exclusions.jsonc) to remove
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
| unova | black-white |  [region-5-black-white.svg](assets/region-5-black-white.svg) | ![black-white completeness](https://maps.pokecompanion.com/completeness/unova-black-white.svg) |
| unova | black-2-white-2 | [region-5-black-2-white-2.svg](assets/region-5-black-2-white-2.svg) | ![black-2-white-2 completeness](https://maps.pokecompanion.com/completeness/unova-black-2-white-2.svg) |
| kalos | x-y | [region-6-x-y.svg](assets/region-6-x-y.svg) | ![x-y completeness](https://maps.pokecompanion.com/completeness/kalos-x-y.svg) |
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

Edit `config/location-exclusions.jsonc` using PokeAPI region and location names, and
version group names (such as `red-blue`). Each entry has:

```json
{
  "region": "kanto",
  "location": ["one-island"],
  "versionGroups": ["red-blue", "yellow"],
  "reason": "One Island is part of the Sevii Islands, introduced in FireRed and LeafGreen.",
  "reappearsIn": ["firered-leafgreen"]
}
```

The `location` array can group several places that share the same reason, version
groups, and reappearance version groups.

The file starts with One Island as an example, based on its
[Sevii Islands game appearances](https://bulbapedia.bulbagarden.net/wiki/Sevii_Islands);
it is not a complete list of game differences. Add further exclusions explicitly.
PokeAPI remains the source of location identities and region/game availability.
Builds reject unknown regions, locations or games, empty reasons or game lists,
duplicate rules for a location/game, and conflicting reappearance games.
`reappearsIn` is optional and may be omitted or empty. It lists games where the location appears or returns; it does not
implicitly exclude any other games.

Map pages offer a game selector within their version group. Excluded locations
are listed at the bottom with their reason and reappearance games, even when
already drawn in the SVG. They are omitted from both matched and total counts
and from the missing list. The CI JSON report includes the same exclusions and
explanations per game. All other PokeAPI locations remain required by default.
