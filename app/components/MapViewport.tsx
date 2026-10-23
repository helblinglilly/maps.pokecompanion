"use client";

import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";
import { useLocationSelection } from "../hooks/use-location-selection";
import { MapLocationTooltip } from "./MapLocationTooltip";
import { getMapLocation } from "../lib/map-location-target";

type Point = { x: number; y: number };
type View = Point & { scale: number };
const zoomSteps = [1, 1.5, 2, 3, 4, 6, 8, 12, 16];
const maxSelectionZoom = 3;
const initial: View = { x: 0, y: 0, scale: 1 };

export function MapViewport({ children }: { children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, Point>());
  const click = useRef<(Point & { pointerId: number; id: string }) | null>(null);
  const [view, setView] = useState(initial);
  const percentage = Math.round(view.scale * 100);
  const { locations, select } = useLocationSelection();

  const selectionKey = JSON.stringify(locations);

  useEffect(() => {
    const selectedIds = new Set<string>(JSON.parse(selectionKey));
    const container = host.current!;
    const artwork = container.querySelector("[data-map-artwork]");
    const root = artwork?.shadowRoot ?? container;
    const targets = [...root.querySelectorAll<SVGGraphicsElement>("svg [id]")]
      .filter((element) => selectedIds.has(element.id));
    if (!targets.length) {
      setView(initial);
      return;
    }
    targets.forEach(target => target.classList.add("highlighted"));
    const bounds = container.getBoundingClientRect();
    const boxes = targets.map(target => target.getBoundingClientRect());
    const left = Math.min(...boxes.map(box => box.left));
    const top = Math.min(...boxes.map(box => box.top));
    const box = {
      left, top,
      width: Math.max(...boxes.map(box => box.right)) - left,
      height: Math.max(...boxes.map(box => box.bottom)) - top,
    };
    if (bounds.width && bounds.height && box.width && box.height) {
      setView((previous) => {
        const width = box.width / previous.scale;
        const height = box.height / previous.scale;
        const centerX = (box.left - bounds.left - previous.x) / previous.scale + width / 2;
        const centerY = (box.top - bounds.top - previous.y) / previous.scale + height / 2;
        const scale = Math.max(1, Math.min(maxSelectionZoom, bounds.width / (width * 1.8), bounds.height / (height * 1.8)));
        return { scale, x: bounds.width / 2 - centerX * scale, y: bounds.height / 2 - centerY * scale };
      });
    }
    return () => targets.forEach(target => target.classList.remove("highlighted"));
  }, [selectionKey]);

  function zoom(factor: number, anchor?: Point) {
    const bounds = host.current!.getBoundingClientRect();
    const point = anchor ?? { x: bounds.width / 2, y: bounds.height / 2 };
    setView((previous) => {
      const scale = Math.max(1, Math.min(16, previous.scale * factor));
      const ratio = scale / previous.scale;
      return {
        scale,
        x: point.x - (point.x - previous.x) * ratio,
        y: point.y - (point.y - previous.y) * ratio,
      };
    });
  }

  function stepZoom(direction: 1 | -1) {
    const next = direction === 1
      ? zoomSteps.find(step => step > view.scale + 0.001) ?? 16
      : [...zoomSteps].reverse().find(step => step < view.scale - 0.001) ?? 1;
    zoom(next / view.scale);
  }

  // A native non-passive listener lets wheel zoom prevent page scrolling.
  useEffect(() => {
    const container = host.current!;
    function wheel(event: WheelEvent) {
      event.preventDefault();
      const bounds = container.getBoundingClientRect();
      // Trackpad pinch arrives as small ctrl+wheel deltas, requiring more gain
      // than ordinary scrolling. Normalize line/page wheel devices to pixels.
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? bounds.height : 1;
      const delta = event.deltaY * unit;
      const sensitivity = event.ctrlKey ? 0.012 : 0.003;
      zoom(Math.exp(-Math.max(-240, Math.min(240, delta)) * sensitivity), {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
    }
    container.addEventListener("wheel", wheel, { passive: false });
    return () => container.removeEventListener("wheel", wheel);
  }, []);

  function down(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const target = getMapLocation(event.nativeEvent.composedPath()[0] ?? event.target);
    click.current = pointers.current.size === 1 && target
      ? { pointerId: event.pointerId, id: target.id, x: event.clientX, y: event.clientY }
      : null;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (click.current && Math.hypot(event.clientX - click.current.x, event.clientY - click.current.y) > 5) {
      click.current = null;
    }
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    const next = { x: event.clientX, y: event.clientY };
    const other = [...pointers.current.entries()].find(([id]) => id !== event.pointerId)?.[1];
    const divisor = other ? 2 : 1;
    setView((view) => ({
      ...view,
      x: view.x + (next.x - previous.x) / divisor,
      y: view.y + (next.y - previous.y) / divisor,
    }));
    if (other) {
      const before = Math.hypot(previous.x - other.x, previous.y - other.y);
      const after = Math.hypot(next.x - other.x, next.y - other.y);
      if (before > 0 && after > 0) {
        const bounds = event.currentTarget.getBoundingClientRect();
        zoom(Math.pow(after / before, 1.25), {
          x: (next.x + other.x) / 2 - bounds.left,
          y: (next.y + other.y) / 2 - bounds.top,
        });
      }
    }
    pointers.current.set(event.pointerId, next);
  }

  function up(event: PointerEvent<HTMLDivElement>) {
    const target = click.current;
    click.current = null;
    pointers.current.delete(event.pointerId);
    if (event.type === "pointerup" && target && target.pointerId === event.pointerId
      && Math.hypot(event.clientX - target.x, event.clientY - target.y) <= 5) {
      select(target.id);
    }
  }

  const buttonClass = "rounded px-3 py-2 hover:bg-slate-100 disabled:opacity-40";
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={host}
        className="h-full w-full touch-none cursor-grab select-none active:cursor-grabbing"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onLostPointerCapture={up}
      >
        <MapLocationTooltip>
        <div
          className="h-full w-full origin-top-left"
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          }}
        >
          {children}
        </div>
        </MapLocationTooltip>
      </div>
      <div
        role="group"
        aria-label="Map zoom controls"
        className="absolute right-3 bottom-3 flex items-center gap-2 rounded-lg border border-slate-300 bg-white p-2 text-slate-900 shadow-sm"
      >
        <button
          type="button"
          aria-label="Zoom out"
          disabled={view.scale <= 1}
          onClick={() => stepZoom(-1)}
          className={buttonClass}
        >
          −
        </button>
        <output aria-label="Map zoom" className="min-w-12 text-center text-sm">
          {percentage}%
        </output>
        <button
          type="button"
          aria-label="Zoom in"
          disabled={view.scale >= 16}
          onClick={() => stepZoom(1)}
          className={buttonClass}
        >
          +
        </button>
        <button type="button" onClick={() => setView(initial)} className={`${buttonClass} text-sm`}>
          Fit map
        </button>
      </div>
    </div>
  );
}
