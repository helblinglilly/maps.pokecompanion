import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { MapArtwork } from "./MapArtwork";
import { defaultMapCss, MapStyleWorkspace } from "./MapStyleEditor";
import { MapViewport } from "./MapViewport";

afterEach(() => window.history.replaceState(null, "", "/"));

it("updates and resets CSS inside the artwork while preserving selection and zoom", () => {
  window.history.replaceState(null, "", "/?location=pallet-town");
  const { container } = render(
    <MapStyleWorkspace sidebar={<p>Location list</p>}>
      <MapViewport>
        <MapArtwork label="Kanto" markup={'<svg><g id="Cities"><path id="pallet-town" /></g></svg>'} />
      </MapViewport>
    </MapStyleWorkspace>,
  );
  const artwork = screen.getByRole("img", { name: "Kanto" });
  const root = artwork.shadowRoot!;
  expect(screen.getByRole("textbox", { name: "Map CSS" })).toHaveValue(defaultMapCss);
  expect(root.querySelectorAll("style")[1].textContent).toBe(defaultMapCss);
  expect(root.querySelector("#pallet-town")).toHaveClass("highlighted");
  fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
  const css = "path, textarea { fill: red; } @media (min-width: 1px) { svg { opacity: .5; } }";
  fireEvent.change(screen.getByRole("textbox", { name: "Map CSS" }), { target: { value: css } });
  expect(root.querySelectorAll("style")[1].textContent).toBe(css);
  expect(container.querySelector("style")).toBeNull();
  expect(root.querySelector("#pallet-town")).toHaveClass("highlighted");
  expect(screen.getByLabelText("Map zoom")).toHaveTextContent("150%");

  const path = root.querySelector("path")!;
  fireEvent.pointerMove(path, { composed: true, clientX: 10, clientY: 10 });
  expect(screen.getByRole("tooltip")).toHaveTextContent("Pallet Town");

  fireEvent.click(screen.getByRole("button", { name: "Reset CSS" }));
  expect(root.querySelectorAll("style")[1].textContent).toBe(defaultMapCss);
  expect(screen.getByRole("textbox", { name: "Map CSS" })).toHaveValue(defaultMapCss);
});
