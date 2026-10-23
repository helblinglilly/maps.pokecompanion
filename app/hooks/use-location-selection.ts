"use client";

import { useSyncExternalStore } from "react";

const selectionChangeEvent = "map-location-selection-change";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(selectionChangeEvent, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(selectionChangeEvent, callback);
  };
}

function readLocations(search: string): string[] {
  const values = new URLSearchParams(search).getAll("location");
  const locations = values.flatMap(value => {
    if (!value.startsWith("[")) return [value];
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.filter((id): id is string => typeof id === "string" && id.length > 0)
        : [];
    } catch {
      return [];
    }
  });
  return [...new Set(locations.filter(Boolean))];
}

export function useLocationSelection() {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => "");
  const locations = readLocations(search);

  function update(next: string[]) {
    const url = new URL(window.location.href);
    url.searchParams.delete("location");
    if (next.length) url.searchParams.set("location", JSON.stringify(next));
    if (url.href !== window.location.href) window.history.pushState(null, "", url);
    // Notify selection subscribers without triggering the router's navigation handler.
    window.dispatchEvent(new Event(selectionChangeEvent));
  }

  return {
    locations,
    select(id: string) {
      update(locations.includes(id) ? locations.filter(item => item !== id) : [...locations, id]);
    },
    clear() {
      update([]);
    },
  };
}
