"use client";

import { useEffect, useRef, useState, type HTMLAttributes } from "react";
import { maps, colours, label } from "../lib/maps";

type View = { x: number; y: number; w: number; h: number };
const initial: View = { x: -200, y: -200, w: 5400, h: 5400 };

export function useMapViewer() {
  const [map, setMap] = useState(0);
  const [locations, setLocations] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [active, setActive] = useState("");
  const [query, setQuery] = useState("");
  const [colour, setColour] = useState(colours[0]);
  const [view, setView] = useState<View>(initial);
  const [status, setStatus] = useState("Loading map…");
  const host = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement | null>(null);
  const base = useRef(initial);
  const drag = useRef<{
    x: number;
    y: number;
    view: View;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("Loading map…");
    setLocations([]);
    setSelected([]);
    setActive("");
    setQuery("");
    fetch(`/maps/${maps[map].file}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Map could not be loaded.");
        return r.text();
      })
      .then((source) => {
        const document = new DOMParser().parseFromString(
          source,
          "image/svg+xml",
        );
        const root = document.documentElement;
        if (root.localName !== "svg" || document.querySelector("parsererror"))
          throw new Error("Invalid SVG file.");
        const imported = window.document.importNode(
          root,
          true,
        ) as unknown as SVGSVGElement;
        const box = imported.viewBox.baseVal;
        base.current = {
          x: box.x - box.width * 0.04,
          y: box.y - box.height * 0.04,
          w: box.width * 1.08,
          h: box.height * 1.08,
        };
        const parts = [...imported.querySelectorAll<SVGElement>("[id]")].filter(
          (el) => /^[a-z]/.test(el.id),
        );
        parts.forEach((el) => {
          el.dataset.location = el.id;
          el.setAttribute("role", "button");
          el.setAttribute("tabindex", "0");
          el.setAttribute("aria-label", label(el.id));
          const title = window.document.createElementNS(
            "http://www.w3.org/2000/svg",
            "title",
          );
          title.textContent = label(el.id);
          el.insertBefore(title, el.firstChild);
          [
            el,
            ...el.querySelectorAll<SVGElement>(
              "path,rect,circle,ellipse,polygon,polyline,line",
            ),
          ].forEach((shape) => {
            shape.dataset.originalStyle = shape.getAttribute("style") || "";
          });
        });
        host.current?.replaceChildren(imported);
        svg.current = imported;
        setLocations(
          parts
            .map((el) => el.id)
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
        );
        setView(base.current);
        setStatus("");
      })
      .catch((error) => {
        if (!controller.signal.aborted) setStatus(error.message);
      });
    return () => {
      controller.abort();
      svg.current = null;
      host.current?.replaceChildren();
    };
  }, [map]);

  useEffect(() => {
    svg.current?.setAttribute(
      "viewBox",
      `${view.x} ${view.y} ${view.w} ${view.h}`,
    );
  }, [view, locations]);
  useEffect(() => {
    svg.current
      ?.querySelectorAll<SVGElement>("[data-location]")
      .forEach((el) => {
        const highlighted = selected.includes(el.id);
        el.setAttribute("aria-pressed", String(highlighted));
        [
          el,
          ...el.querySelectorAll<SVGElement>("[data-original-style]"),
        ].forEach((shape) => {
          shape.classList.toggle(
            "fill-(--highlight-colour)!",
            highlighted && shape.style.fill !== "none",
          );
          shape.classList.toggle(
            "stroke-(--highlight-colour)!",
            highlighted &&
              !!shape.style.stroke &&
              shape.style.stroke !== "none",
          );
        });
      });
  }, [selected, colour, locations]);

  function toggle(id: string) {
    setActive(id);
    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  }
  function zoom(factor: number, px = 0.5, py = 0.5) {
    setView((v) => {
      const w = Math.max(
        base.current.w / 16,
        Math.min(base.current.w * 1.5, v.w * factor),
      );
      const h = (w * base.current.h) / base.current.w;
      return { x: v.x + (v.w - w) * px, y: v.y + (v.h - h) * py, w, h };
    });
  }
  function focus(id: string) {
    const el = svg.current?.getElementById(id) as SVGGraphicsElement | null;
    if (!el || !svg.current) return;
    const box = el.getBBox();
    const matrix = el.getCTM();
    const rootMatrix = svg.current.getCTM();
    if (!matrix || !rootMatrix) return;
    const transform = rootMatrix.inverse().multiply(matrix);
    const corners = [
      [box.x, box.y],
      [box.x + box.width, box.y],
      [box.x, box.y + box.height],
      [box.x + box.width, box.y + box.height],
    ].map(([x, y]) => new DOMPoint(x, y).matrixTransform(transform));
    const xs = corners.map((p) => p.x),
      ys = corners.map((p) => p.y);
    const w = Math.min(
      base.current.w,
      Math.max(
        900,
        (Math.max(...xs) - Math.min(...xs)) * 1.8,
        ((Math.max(...ys) - Math.min(...ys)) * 1.8 * base.current.w) /
          base.current.h,
      ),
    );
    const h = (w * base.current.h) / base.current.w;
    setView({
      x: (Math.min(...xs) + Math.max(...xs) - w) / 2,
      y: (Math.min(...ys) + Math.max(...ys) - h) / 2,
      w,
      h,
    });
    setActive(id);
  }
  const filtered = locations.filter((id) =>
    label(id).toLowerCase().includes(query.toLowerCase()),
  );

  const canvasHandlers: HTMLAttributes<HTMLDivElement> = {
    onWheel: (e) => {
      const r = host.current!.getBoundingClientRect();
      zoom(
        e.deltaY > 0 ? 1.12 : 1 / 1.12,
        (e.clientX - r.left) / r.width,
        (e.clientY - r.top) / r.height,
      );
    },
    onPointerDown: (e) => {
      if (e.button !== 0) return;
      drag.current = { x: e.clientX, y: e.clientY, view, moved: false };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerMove: (e) => {
      const d = drag.current;
      if (!d) return;
      const dx = e.clientX - d.x,
        dy = e.clientY - d.y;
      if (Math.hypot(dx, dy) > 5) d.moved = true;
      if (!d.moved) return;
      const r = host.current!.getBoundingClientRect();
      const scale = Math.max(d.view.w / r.width, d.view.h / r.height);
      setView({
        ...d.view,
        x: d.view.x - dx * scale,
        y: d.view.y - dy * scale,
      });
    },
    onPointerUp: (e) => {
      const d = drag.current;
      drag.current = null;
      if (d && !d.moved) {
        const target = window.document
          .elementFromPoint(e.clientX, e.clientY)
          ?.closest<SVGElement>("[data-location]");
        if (target) toggle(target.id);
      }
    },
    onPointerCancel: () => {
      drag.current = null;
    },
    onKeyDown: (e) => {
      const target = (e.target as Element).closest<SVGElement>(
        "[data-location]",
      );
      if (target && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        toggle(target.id);
      }
    },
  };
  return {
    map,
    setMap,
    locations,
    selected,
    active,
    query,
    setQuery,
    colour,
    setColour,
    status,
    host,
    filtered,
    toggle,
    zoom,
    focus,
    canvasHandlers,
    clearHighlights: () => setSelected([]),
    fitMap: () => setView(base.current),
    zoomPercentage: Math.round((base.current.w / view.w) * 100),
  };
}

export type MapViewer = ReturnType<typeof useMapViewer>;
