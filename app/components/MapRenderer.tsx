/// <reference types="vite/client" />

import { MapArtwork } from "./MapArtwork";
import { MapViewport } from "./MapViewport";

// Vite bundles local artwork on the server, including in the Cloudflare runtime.
const maps = import.meta.glob<string>("../../assets/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});

export const MapRenderer = ({ src, label }: { src: string; label: string }) => {
  const source = maps[`../../assets/${src.replace(/^\/maps\//, "")}`];
  if (!source) throw new Error(`Map artwork not found: ${src}`);
  // Only repository-owned SVG artwork is accepted. Preserve its root attributes.
  const markup = source.slice(source.indexOf("<svg"));

  return (
    <MapViewport key={src}>
      <MapArtwork markup={markup} label={label} />
    </MapViewport>
  );
};
