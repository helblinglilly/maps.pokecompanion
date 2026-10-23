import type { LocationExclusion } from '../app/lib/location-exclusions.ts';
import { validateMapIds, type RegionLocation } from '../app/lib/map-validation.ts';

export function scoreMap(ids: string[], locations: RegionLocation[], hasMap: boolean, exclusions: LocationExclusion[] = []) {
  const { elements, missing, matched, total, percent, excluded } = validateMapIds(hasMap ? ids : [], locations, exclusions);
  return {
    matched,
    total,
    percent: hasMap ? percent : 0,
    status: !hasMap ? 'missing map' : !total ? 'no applicable locations' : 'available',
    excluded,
    missing: missing.map(location => location.name),
    unknown: elements.filter(element => !element.location).map(element => element.id),
  };
}

export function badge(label: string, message: string, color: string) {
  const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const left = Math.max(70, label.length * 7 + 12);
  const right = Math.max(50, message.length * 7 + 12);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${left + right}" height="20" role="img" aria-label="${escape(`${label}: ${message}`)}"><title>${escape(`${label}: ${message}`)}</title><rect width="${left}" height="20" fill="#555"/><rect x="${left}" width="${right}" height="20" fill="${color}"/><g fill="#fff" text-anchor="middle" font-family="Verdana,sans-serif" font-size="11"><text x="${left / 2}" y="14">${escape(label)}</text><text x="${left + right / 2}" y="14">${escape(message)}</text></g></svg>\n`;
}
