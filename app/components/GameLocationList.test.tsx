import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { GameLocationList } from "./GameLocationList";

it("searches every location list without changing coverage or hidden selections", () => {
  window.history.replaceState(null, "", "/");
  render(
    <GameLocationList
      regionSlug="kanto"
      regionName="Kanto"
      group={{ slug: "red-blue", name: "Red / Blue" }}
      ids={["pallet-town", "route-1", "unknown-place"]}
      locations={["pallet-town", "route-1", "viridian-city", "one-island"].map((name) => ({
        name,
        url: `https://pokeapi.co/${name}`,
      }))}
    />,
  );
  fireEvent.click(screen.getByRole("checkbox", { name: "pallet-town" }));
  const search = screen.getByRole("searchbox", { name: "Search locations" });
  fireEvent.change(search, { target: { value: " ROUTE 1 " } });
  expect(screen.getByRole("checkbox", { name: "route-1" })).toBeInTheDocument();
  expect(screen.queryByRole("checkbox", { name: "pallet-town" })).not.toBeInTheDocument();
  expect(screen.getByText("1 selected")).toBeInTheDocument();
  fireEvent.change(search, { target: { value: "viridian" } });
  expect(screen.getByRole("link", { name: "viridian-city" })).toBeInTheDocument();
  fireEvent.change(search, { target: { value: "one island" } });
  expect(screen.getByRole("link", { name: "one-island" })).toBeInTheDocument();
  fireEvent.change(search, { target: { value: "no such location" } });
  expect(screen.getByRole("status")).toHaveTextContent("No locations match your search.");
  fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
  expect(search).toHaveValue("");
  expect(screen.getByRole("checkbox", { name: "pallet-town" })).toBeChecked();
  fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
});
