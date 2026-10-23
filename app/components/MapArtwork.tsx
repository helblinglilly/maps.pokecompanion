"use client";

import { useEffect, useRef } from "react";
import { locationSelector } from "../lib/map-location-target";
import { useMapCss } from "./MapStyleEditor";

// Keep arbitrary CSS inside a shadow tree, including broad selectors and at-rules.
// The light-DOM copy provides artwork before hydration.
export function MapArtwork({ markup, label }: { markup: string; label: string }) {
  const host = useRef<HTMLDivElement>(null);
  const stylesheet = useRef<HTMLStyleElement | null>(null);
  const css = useMapCss();

  useEffect(() => {
    const element = host.current!;
    const root = element.shadowRoot ?? element.attachShadow({ mode: "open" });
    root.innerHTML = markup;
    const sizing = document.createElement("style");
    sizing.textContent = `:host { display: block; height: 100%; width: 100%; } svg { display: block; height: 100%; width: 100%; } ${locationSelector} { cursor: pointer; }`;
    const custom = document.createElement("style");
    root.append(sizing, custom);
    stylesheet.current = custom;
    element.innerHTML = "";
  }, [markup]);

  useEffect(() => {
    if (stylesheet.current) stylesheet.current.textContent = css;
  }, [css, markup]);

  return <div ref={host} role="img" aria-label={label} data-map-artwork className="h-full w-full [&>svg]:block [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: markup }} />;
}
