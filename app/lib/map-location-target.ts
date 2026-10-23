export const locationSelector = ["Cities", "Routes", "POI", "Points-of-Interest", "Points of Interest"]
  .map(id => `[id="${id}"] [id]`).join(", ");

export function getMapLocation(target: EventTarget | null): Element | null {
  return target instanceof Element ? target.closest(locationSelector) : null;
}
