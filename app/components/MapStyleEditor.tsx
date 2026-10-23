"use client";

import { ResizeHandle } from "./ResizeHandle";
import { CssEditor } from "./CssEditor";
import { createContext, useContext, useState, type ReactNode, type CSSProperties } from "react";

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

#Gates * {
  display: none;
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

  const [workspaceSplit, setWorkspaceSplit] = useState(35);
  const [sidebarSplit, setSidebarSplit] = useState(55);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <MapCssContext.Provider value={css}>
      <div
        className="map-workspace"
        style={{ "--workspace-split": `${workspaceSplit}%` } as CSSProperties}
      >
        <div className="map-workspace-sidebar">
          <div
            className="min-h-0 min-w-0 overflow-hidden"
            style={{ flex: collapsed ? 1 : `${sidebarSplit} 1 0` }}
          >
            {sidebar}
          </div>
          {!collapsed && (
            <ResizeHandle
              label="Resize locations and CSS panels"
              value={sidebarSplit}
              onChange={setSidebarSplit}
            />
          )}
          <MapStyleEditor
            css={css}
            onChange={setCss}
            collapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
            size={100 - sidebarSplit}
          />
        </div>
        <ResizeHandle
          label="Resize sidebar and map"
          value={workspaceSplit}
          onChange={setWorkspaceSplit}
          responsive
        />
        <main className="min-h-0 min-w-0 overflow-hidden">{children}</main>
      </div>
    </MapCssContext.Provider>
  );
}

function MapStyleEditor({
  css,
  onChange,
  collapsed,
  onToggle,
  size,
}: {
  css: string;
  onChange: (css: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  size: number;
}) {
  return (
    <section
      aria-labelledby="map-css-heading"
      className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-[#d7dfd5] bg-white p-5"
      style={{ flex: collapsed ? "0 0 auto" : `${size} 1 0` }}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="map-css-heading" className="text-lg font-semibold">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={!collapsed}
            aria-controls="map-css-content"
            className="flex items-center gap-2 rounded focus-visible:outline-2 focus-visible:outline-green-700"
          >
            <span aria-hidden="true">{collapsed ? "▸" : "▾"}</span>
            Custom CSS
          </button>
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
      <div
        id="map-css-content"
        hidden={collapsed}
        className="map-css-content min-h-0 flex-1 flex-col"
      >
        <p id="map-css-help" className="mt-2 text-xs text-[#52665e]">
          Applied live to this map only. Target SVG elements, location IDs, or .highlighted.
        </p>
        <label htmlFor="map-css" className="sr-only">
          Map CSS
        </label>
        <CssEditor value={css} onChange={onChange} />
      </div>
    </section>
  );
}
