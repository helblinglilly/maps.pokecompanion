import { expect, it } from 'vitest';
import { exclusionsForVersionGroup, validateLocationExclusions, type LocationExclusion } from './location-exclusions';

const regions = [{ slug: 'kanto', locations: [{ name: 'one-island' }], groups: ['red-blue', 'yellow', 'gold-silver', 'crystal', 'firered-leafgreen'].map(slug => ({ slug })) }];
const rule: LocationExclusion = { region: 'kanto', location: 'one-island', versionGroups: ['red-blue'], reason: 'Added later.', reappearsIn: ['firered-leafgreen'] };

it('scopes exclusions to both region and version group', () => {
  expect(exclusionsForVersionGroup('kanto', 'red-blue').some(rule => rule.location === 'one-island')).toBe(true);
  expect(exclusionsForVersionGroup('kanto', 'firered-leafgreen')).toEqual([]);
  expect(exclusionsForVersionGroup('johto', 'red-blue')).toEqual([]);
});
it('validates all rule references against the PokeAPI catalog', () => {
  expect(() => validateLocationExclusions(regions, [rule])).not.toThrow();
  for (const invalid of [
    { ...rule, region: 'typo' }, { ...rule, location: 'typo' },
    { ...rule, versionGroups: ['typo'] }, { ...rule, reappearsIn: ['typo'] },
    { ...rule, reason: ' ' }, { ...rule, versionGroups: [] }, { ...rule, reappearsIn: [] },
    { ...rule, reappearsIn: ['red-blue'] },
  ]) expect(() => validateLocationExclusions(regions, [invalid])).toThrow();
  expect(() => validateLocationExclusions(regions, [rule, rule])).toThrow(/Duplicate/);
  expect(() => validateLocationExclusions(regions, [rule, { ...rule, versionGroups: ['firered-leafgreen'], reappearsIn: ['yellow'] }])).toThrow(/conflicts/);
});
