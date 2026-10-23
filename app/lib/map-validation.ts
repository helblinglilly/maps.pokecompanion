import type { LocationExclusion } from './location-exclusions.ts';
import { splitMapLocationIds } from './map-location-ids.ts';

/** Read IDs from our trusted SVG assets, including non-location groups. */
export function extractSvgIds(svg: string): string[] {
  const markup = svg.replace(/<!--[\s\S]*?-->/g, '');
  const ids = Array.from(markup.matchAll(/<[a-zA-Z][^>]*\s+id\s*=\s*(["'])(.*?)\1/g), match => match[2]);
  return [...new Set(ids)];
}

export interface RegionLocation {
  name: string;
  url: string;
}

export function validateMapIds(ids: string[], locations: RegionLocation[], exclusions: LocationExclusion[] = []) {
  const structuralIds = new Set(['Cities', 'Routes', 'POI', 'Points-of-Interest', 'Points of Interest']);
  const byName = new Map(locations.map(location => [location.name, location]));
  const present = new Set(ids.flatMap(splitMapLocationIds));
  const excludedNames = new Set(exclusions.map(rule => rule.location));
  const eligible = locations.filter(location => !excludedNames.has(location.name));
  const missing = eligible.filter(location => !present.has(location.name));
  const matched = eligible.length - missing.length;
  return {
    total: eligible.length,
    matched,
    percent: eligible.length ? Math.round(matched / eligible.length * 1000) / 10 : 0,
    excluded: exclusions.flatMap(rule => {
      const location = byName.get(rule.location);
      return location ? [{ ...rule, ...location }] : [];
    }),
    elements: [...present].filter(id => !structuralIds.has(id) && !excludedNames.has(id)).map(id => ({ id, location: byName.get(id) })),
    missing,
  };
}
