"use client";

import { useRef } from "react";

export function ResizeHandle({ label, value, onChange, responsive = false }: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  responsive?: boolean;
}) {
  const drag = useRef<{ start: number; value: number; size: number; horizontal: boolean } | null>(null);
  const clamp = (next: number) => Math.max(20, Math.min(80, next));

  return (
    <div
      role="separator"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={20}
      aria-valuemax={80}
      aria-valuenow={Math.round(value)}
      className={`workspace-resize-handle${responsive ? " workspace-resize-handle-responsive" : ""}`}
      onPointerDown={event => {
        if (event.button !== 0) return;
        const horizontal = responsive && window.matchMedia("(min-width: 64rem)").matches;
        const bounds = event.currentTarget.parentElement!.getBoundingClientRect();
        drag.current = { start: horizontal ? event.clientX : event.clientY, value, size: horizontal ? bounds.width : bounds.height, horizontal };
        event.currentTarget.setPointerCapture(event.pointerId);
        event.preventDefault();
      }}
      onPointerMove={event => {
        const current = drag.current;
        if (!current || !current.size) return;
        const position = current.horizontal ? event.clientX : event.clientY;
        onChange(clamp(current.value + (position - current.start) / current.size * 100));
      }}
      onPointerUp={() => { drag.current = null; }}
      onPointerCancel={() => { drag.current = null; }}
      onLostPointerCapture={() => { drag.current = null; }}
      onKeyDown={event => {
        const delta = { ArrowLeft: -2, ArrowUp: -2, ArrowRight: 2, ArrowDown: 2 }[event.key];
        if (delta !== undefined || event.key === "Home" || event.key === "End") {
          event.preventDefault();
          onChange(event.key === "Home" ? 20 : event.key === "End" ? 80 : clamp(value + delta!));
        }
      }}
    />
  );
}
