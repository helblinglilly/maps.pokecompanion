"use client";

import { CssEditor } from "./CssEditor";
import { createContext, useContext, useState, type ReactNode } from "react";

export const defaultMapCss = `#Routes * {
  /* stroke: grey !important; */
  /* stroke-width: 40px !important; */
}

#Routes > .highlighted {
  /* stroke-width: 50px !important; */
}

#Cities * {
  /* fill: red !important; */
}

#POI * {
  /* fill: blue !important; */
}

.highlighted {
  animation: map-highlight-pulse 1.5s ease-in-out infinite;
}

@keyframes map-highlight-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}`;

const MapCssContext = createContext(defaultMapCss);
export const useMapCss = () => useContext(MapCssContext);

export function MapStyleWorkspace({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  const [css, setCss] = useState(defaultMapCss);

  return (
    <MapCssContext.Provider value={css}>
      <div className="grid h-[calc(100dvh-2rem)] min-h-0 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-6 overflow-hidden md:h-[calc(100dvh-4rem)] lg:grid-cols-[22rem_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)]">
        <div className="flex min-h-0 min-w-0 flex-col gap-4">
          <div className="min-h-24 flex-1 overflow-hidden">{sidebar}</div>
          <MapStyleEditor css={css} onChange={setCss} />
        </div>
        <main className="min-h-0 min-w-0 overflow-hidden">{children}</main>
      </div>
    </MapCssContext.Provider>
  );
}

function MapStyleEditor({ css, onChange }: { css: string; onChange: (css: string) => void }) {
  return (
    <section
      aria-labelledby="map-css-heading"
      className="flex shrink-0 flex-col rounded-lg border border-[#d7dfd5] bg-white p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="map-css-heading" className="text-lg font-semibold">
          Custom CSS
        </h2>
        <button
          type="button"
          disabled={css === defaultMapCss}
          onClick={() => onChange(defaultMapCss)}
          className="rounded px-2 py-1 text-sm underline disabled:opacity-40"
        >
          Reset CSS
        </button>
      </div>
      <p id="map-css-help" className="mt-2 text-xs text-[#52665e]">
        Applied live to this map only. Target SVG elements, location IDs, or .highlighted.
      </p>
      <label htmlFor="map-css" className="sr-only">
        Map CSS
      </label>
      <CssEditor value={css} onChange={onChange} />
    </section>
  );
}
