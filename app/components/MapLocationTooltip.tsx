"use client";

import { useState, type ReactNode, type PointerEvent } from "react";
import { getMapLocation } from "../lib/map-location-target";

export function MapLocationTooltip({ children }: { children: ReactNode }) {
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);

  function move(event: PointerEvent<HTMLDivElement>) {
    const location = getMapLocation(event.nativeEvent.composedPath()[0] ?? event.target);
    if (!location || event.buttons || event.pointerType === "touch") {
      setTooltip(null);
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    setTooltip({
      name: location.id.replaceAll("-", " ").replace(/\b\w/g, letter => letter.toUpperCase()),
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
          className="pointer-events-none absolute z-10 max-w-full rounded bg-slate-900 px-3 py-2 text-sm text-white shadow"
          style={{
            left: `clamp(0px, ${tooltip.x + 12}px, max(0px, 100% - 240px))`,
            top: Math.max(0, tooltip.y - 44),
          }}
        >
          {tooltip.name}
        </div>
      )}
    </div>
  );
}
