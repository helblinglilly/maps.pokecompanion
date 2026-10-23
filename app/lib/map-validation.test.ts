import { describe, expect, it } from 'vitest';
import { extractSvgIds, validateMapIds } from './map-validation';

describe('map validation', () => {
  it('recognizes underscore-separated shared location IDs', () => {
    const ids = extractSvgIds(`<svg><g id="Cities"><g id="black-city_white-forest" /></g></svg>`);
    expect(ids).toEqual(['Cities', 'black-city_white-forest']);
    const locations = ['black-city', 'white-forest'].map(name => ({ name, url: name }));
    expect(validateMapIds(ids, locations)).toMatchObject({ matched: 2, total: 2, missing: [] });
  });
  it('includes structural and location IDs, ignoring comments and duplicate IDs', () => {
    expect(extractSvgIds(`<svg><g id="Routes"><path id='kanto-route-1'/></g>
      <!-- <g id="obsolete"/> --><g id="Routes"/><path data-id="not-an-id"/></svg>`))
      .toEqual(['Routes', 'kanto-route-1']);
  });

  it('reports unmatched IDs and missing API locations without guessing aliases', () => {
    const locations = [
      { name: 'pallet-town', url: 'https://pokeapi.co/api/v2/location/86/' },
      { name: 'vermilion-city', url: 'https://pokeapi.co/api/v2/location/93/' },
    ];
    const result = validateMapIds(['Cities', 'Routes', 'POI', 'Points-of-Interest', 'Points of Interest', 'pallet-town', 'vermillion-city'], locations);
    expect(result.elements.map(element => element.id)).toEqual(['pallet-town', 'vermillion-city']);
    expect(result.elements.map(element => element.location?.name)).toEqual(['pallet-town', undefined]);
    expect(result.missing).toEqual([locations[1]]);
  });
});
