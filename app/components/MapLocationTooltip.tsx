"use client";

import { useState, type ReactNode, type PointerEvent } from "react";
import { getMapLocation } from "../lib/map-location-target";

export function MapLocationTooltip({ children }: { children: ReactNode }) {
  const [tooltip, setTooltip] = useState<{ names: string[]; x: number; y: number } | null>(null);

  function move(event: PointerEvent<HTMLDivElement>) {
    const location = getMapLocation(event.nativeEvent.composedPath()[0] ?? event.target);
    if (!location || event.buttons || event.pointerType === "touch") {
      setTooltip(null);
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    setTooltip({
      names: location.id.split("_").filter(Boolean).map(name =>
        name.replaceAll("-", " ").replace(/\b\w/g, letter => letter.toUpperCase()),
      ),
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  }

  return (
    <div
      className="relative h-full w-full"
      onPointerMove={move}
      onPointerLeave={() => setTooltip(null)}
      onPointerDown={() => setTooltip(null)}
    >
      {children}
      {tooltip && (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-10 w-60 max-w-full -translate-y-full overflow-hidden rounded-lg border border-white/10 bg-slate-900 text-sm text-white shadow-lg"
          style={{
            left: `clamp(0px, ${tooltip.x + 12}px, max(0px, 100% - 240px))`,
            top: Math.max(0, tooltip.y - 12),
          }}
        >
          {tooltip.names.length > 1 && (
            <div className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {tooltip.names.length} locations
            </div>
          )}
          <ul className="divide-y divide-white/10 px-3">
            {tooltip.names.map((name, index) => (
              <li key={`${index}-${name}`} className="py-2 text-left leading-snug break-words">{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
