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

export function validateMapIds(ids: string[], locations: RegionLocation[]) {
  const structuralIds = new Set(['Cities', 'Routes', 'POI', 'Points-of-Interest', 'Points of Interest']);
  const byName = new Map(locations.map(location => [location.name, location]));
  const present = new Set(ids);
  return {
    elements: ids.filter(id => !structuralIds.has(id)).map(id => ({ id, location: byName.get(id) })),
    missing: locations.filter(location => !present.has(location.name)),
  };
}
