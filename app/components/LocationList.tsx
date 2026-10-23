"use client";

import { useState } from "react";
import { LocationSearch } from "./LocationSearch";
import { exclusionsForVersionGroup } from "../lib/location-exclusions";
import { ExcludedLocations } from "./ExcludedLocations";
import { validateMapIds, type RegionLocation } from "../lib/map-validation";
import { useLocationSelection } from "../hooks/use-location-selection";

export function LocationList({
  regionName,
  regionSlug,
  versionGroup,
  versionGroupName,
  ids,
  locations,
}: {
  regionName: string;
  regionSlug: string;
  versionGroup: string;
  versionGroupName: string;
  ids: string[];
  locations: RegionLocation[];
}) {
  const selection = useLocationSelection();
  const [query, setQuery] = useState("");
  const normalize = (value: string) => value.toLowerCase().replace(/[-_\s]+/g, " ").trim();
  const search = normalize(query);
  const matches = (value: string) => normalize(value).includes(search);
  const { elements, missing, matched, total, percent, excluded } = validateMapIds(ids, locations, exclusionsForVersionGroup(regionSlug, versionGroup));
  const sortedElements = [...elements].sort(
    (a, b) => Number(Boolean(a.location)) - Number(Boolean(b.location)),
  );

  const visibleMissing = missing.filter(location => matches(location.name));
  const visibleElements = sortedElements.filter(element => matches(element.id));
  const visibleExcluded = excluded.filter(location => matches(location.name));
  const resultCount = visibleMissing.length + visibleElements.length + visibleExcluded.length;

  return (
    <aside
      aria-labelledby="map-elements-heading"
      tabIndex={0}
      className="h-full min-h-0 min-w-0 overflow-y-auto overscroll-contain rounded-lg border border-[#d7dfd5] bg-white p-5"
    >
      <div className="sticky -top-5 z-10 -mx-5 -mt-5 mb-5 border-b border-[#d7dfd5] bg-white px-5 py-3">
        <div className="flex items-center justify-between gap-3">
        <span className="text-sm" aria-live="polite">{selection.locations.length} selected</span>
        <button
          type="button"
          onClick={selection.clear}
          disabled={!selection.locations.length}
          className="rounded border border-[#d7dfd5] px-3 py-2 text-sm hover:bg-slate-100 disabled:opacity-40"
        >
          Clear all
        </button>
        </div>
        <LocationSearch query={query} onQueryChange={setQuery} />
        {search && <p className="mt-2 text-xs" role="status">{resultCount ? `${resultCount} results` : "No locations match your search."}</p>}
      </div>
      <h1 id="map-elements-heading" className="text-lg font-semibold">
        {regionName} map elements
      </h1>
      <p className="mt-2 text-sm">
        {matched} of {total} applicable locations matched for Pokémon {versionGroupName}{total ? ` (${percent}%)` : " (no applicable locations)"}
      </p>
      <h2 className="mt-6 font-semibold">Missing from Map ({search ? `${visibleMissing.length} of ${missing.length}` : missing.length})</h2>
      <p className="mt-2 text-xs">
        Applicable PokeAPI locations that are missing from the map.
      </p>
      <ul className="mt-3 space-y-2 text-sm text-amber-800">
        {visibleMissing.map((location) => (
          <li key={location.name}>
            <a href={location.url} className="wrap-break-word underline">
              {location.name}
            </a>
          </li>
        ))}
      </ul>

      <h2 className="text-lg font-semibold">Map elements{search ? ` (${visibleElements.length} of ${elements.length})` : ""}</h2>

      <p className="mt-2 text-xs text-[#52665e]">
        Compared with PokeAPI, with documented exclusions for this version group.
      </p>
      <ul className="mt-4 space-y-3 text-sm">
        {visibleElements.map(({ id, location }) => (
          <li key={id} className="wrap-break-word">
            <span className="inline-flex max-w-full items-center gap-2">
              <label className="inline-flex min-w-0 cursor-pointer items-center gap-2 hover:underline">
                <input
                  type="checkbox"
                  checked={selection.locations.includes(id)}
                  onChange={() => selection.select(id)}
                  className="size-4 shrink-0 accent-green-700"
                />
                <code className={selection.locations.includes(id) ? "font-bold" : undefined}>{id}</code>
              </label>
              {location && (
                <span
                  className="relative inline-flex size-2 shrink-0"
                  role="img"
                  aria-label="Matched in PokeAPI"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inline-flex size-full rounded-full bg-green-500 opacity-75"
                  />
                  <span
                    aria-hidden="true"
                    className="relative inline-flex size-2 rounded-full bg-green-600"
                  />
                </span>
              )}
            </span>
            {!location && <span className="mt-1 block text-xs text-amber-800">Not in PokeAPI</span>}
          </li>
        ))}
      </ul>

      {!elements.length && <p className="mt-4 text-sm">No location SVG IDs found.</p>}

      {total > 0 && !missing.length && <p className="mt-3 text-sm">All applicable locations are present.</p>}
      <ExcludedLocations locations={visibleExcluded} versionGroupName={versionGroupName} />
    </aside>
  );
}
