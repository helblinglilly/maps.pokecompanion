/** A single SVG element can represent multiple PokeAPI locations. */
export function splitMapLocationIds(id: string): string[] {
  return [...new Set(id.split('_').map(name => name.trim()).filter(Boolean))];
}
