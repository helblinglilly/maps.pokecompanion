import { describe, expect, it } from 'vitest';
import { badge, scoreMap } from './map-completeness';

const locations = ['pallet-town', 'kanto-route-1'].map(name => ({ name, url: name }));
describe('completeness scores', () => {
  it('counts unique API locations and exposes missing and unknown IDs', () => {
    expect(scoreMap(['Cities', 'pallet-town', 'pallet-town', 'typo'], locations, true)).toEqual({
      matched: 1, total: 2, percent: 50, status: 'available', missing: ['kanto-route-1'], unknown: ['typo'], excluded: [],
    });
  });
  it('does not claim completeness for missing maps or empty API regions', () => {
    expect(scoreMap([], locations, false)).toMatchObject({ percent: 0, status: 'missing map' });
    expect(scoreMap([], [], true)).toMatchObject({ percent: 0, status: 'no applicable locations' });
  });
  it('removes game exclusions from both the numerator and denominator', () => {
    const exclusions = [{ region: 'kanto', location: 'kanto-route-1', versionGroups: ['red-blue'], reason: 'Not available.', reappearsIn: ['firered-leafgreen'] }];
    const absent = scoreMap(['pallet-town'], locations, true, exclusions);
    const drawn = scoreMap(['pallet-town', 'kanto-route-1'], locations, true, exclusions);
    expect(absent).toMatchObject({ matched: 1, total: 1, percent: 100, missing: [], unknown: [] });
    expect(drawn).toEqual(absent);
    expect(absent.excluded[0].reason).toBe('Not available.');
    expect(scoreMap(['pallet-town'], locations, true).percent).toBe(50);
  });
  it('does not claim 100% when every location is excluded', () => {
    const exclusions = locations.map(location => ({ region: 'kanto', location: location.name, versionGroups: ['red-blue'], reason: 'Not available.', reappearsIn: ['firered-leafgreen'] }));
    expect(scoreMap(locations.map(location => location.name), locations, true, exclusions))
      .toMatchObject({ total: 0, matched: 0, percent: 0, status: 'no applicable locations', missing: [] });
  });
  it('escapes badge text', () => {
    expect(badge('a&b', '<unknown>', '#555')).toContain('a&amp;b: &lt;unknown&gt;');
  });
});
