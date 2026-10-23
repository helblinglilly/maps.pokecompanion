import { describe, expect, it } from 'vitest';
import { validateMapAssets } from './map-assets';

const regions = [{ id: 1, version_groups: [{ name: 'red-blue' }, { name: 'yellow' }] }];

describe('PokeAPI map assignments', () => {
  it('allows shared artwork with arbitrary filenames and missing coverage', () => {
    expect(() => validateMapAssets(regions, ['kanto.svg'], {
      1: { 'red-blue': 'kanto.svg', yellow: 'kanto.svg' },
    })).not.toThrow();
    expect(() => validateMapAssets(regions, [], {})).not.toThrow();
  });

  it('rejects groups absent from the API even when a matching filename exists', () => {
    expect(() => validateMapAssets(regions, ['region-1-invented.svg'], {
      1: { invented: 'region-1-invented.svg' },
    })).toThrow('unknown PokeAPI version group');
  });

  it('rejects unknown regions and missing artwork', () => {
    expect(() => validateMapAssets(regions, [], { 2: {} })).toThrow('unknown PokeAPI region');
    expect(() => validateMapAssets(regions, [], {
      1: { yellow: 'missing.svg' },
    })).toThrow('missing SVG');
  });
});
