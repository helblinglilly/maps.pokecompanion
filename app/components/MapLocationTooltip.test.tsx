import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MapLocationTooltip } from './MapLocationTooltip';

it('shows names for nested city, route and POI artwork and clears on leaving', () => {
  const { container } = render(
    <MapLocationTooltip>
      <svg>
        <g id="Cities"><g id="pallet-town"><path data-testid="city" /></g></g>
        <g id="Routes"><path id="kanto-route-1" data-testid="route" /></g>
        <g id="POI"><path id="viridian-forest" data-testid="poi" /></g>
      </svg>
    </MapLocationTooltip>,
  );
  for (const [target, name] of [['city', 'Pallet Town'], ['route', 'Kanto Route 1'], ['poi', 'Viridian Forest']]) {
    fireEvent.pointerMove(screen.getByTestId(target));
    expect(screen.getByRole('tooltip')).toHaveTextContent(name);
  }
  fireEvent.pointerMove(container.querySelector('#Cities')!);
  expect(screen.queryByRole('tooltip')).toBeNull();
  fireEvent.pointerMove(screen.getByTestId('city'));
  fireEvent.pointerDown(screen.getByTestId('city'));
  expect(screen.queryByRole('tooltip')).toBeNull();
  fireEvent.pointerMove(screen.getByTestId('city'));
  fireEvent.pointerLeave(container.firstChild!);
  expect(screen.queryByRole('tooltip')).toBeNull();
});
