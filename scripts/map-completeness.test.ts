import { describe, expect, it } from 'vitest';
import { badge, scoreMap } from './map-completeness';

const locations = ['pallet-town', 'kanto-route-1'].map(name => ({ name, url: name }));
describe('completeness scores', () => {
  it('counts unique API locations and exposes missing and unknown IDs', () => {
    expect(scoreMap(['Cities', 'pallet-town', 'pallet-town', 'typo'], locations, true)).toEqual({
      matched: 1, total: 2, percent: 50, status: 'available', missing: ['kanto-route-1'], unknown: ['typo'],
    });
  });
  it('does not claim completeness for missing maps or empty API regions', () => {
    expect(scoreMap([], locations, false)).toMatchObject({ percent: 0, status: 'missing map' });
    expect(scoreMap([], [], true)).toMatchObject({ percent: 0, status: 'no API locations' });
  });
  it('escapes badge text', () => {
    expect(badge('a&b', '<unknown>', '#555')).toContain('a&amp;b: &lt;unknown&gt;');
  });
});
