import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';
import { MapViewport } from './MapViewport';
import { LocationList } from './LocationList';

afterEach(() => {
  window.history.replaceState(null, '', '/');
  vi.restoreAllMocks();
});

it('toggles multiple locations, restores URL selection and clears all highlights', () => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 0, y: 0, left: 0, top: 0, right: 800, bottom: 600, width: 800, height: 600,
    toJSON() {},
  });
  vi.spyOn(SVGElement.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 100, y: 100, left: 100, top: 100, right: 200, bottom: 150, width: 100, height: 50,
    toJSON() {},
  });
  window.history.replaceState(null, '', '/?other=kept');
  const { container } = render(<>
    <LocationList regionName="Kanto" ids={['green-path', 'sevault-canyon']} locations={[]} />
    <MapViewport><svg><path id="green-path" /><path id="sevault-canyon" /></svg></MapViewport>
  </>);
  fireEvent.click(screen.getByRole('checkbox', { name: 'green-path' }));
  expect(new URLSearchParams(window.location.search).get('location')).toBe(JSON.stringify(['green-path']));
  expect(container.querySelector('#green-path')).toHaveClass('highlighted');
  expect(screen.getByLabelText('Map zoom')).toHaveTextContent('300%');
  fireEvent.click(screen.getByRole('checkbox', { name: 'sevault-canyon' }));
  expect(container.querySelector('#green-path')).toHaveClass('highlighted');
  expect(new URLSearchParams(window.location.search).getAll('location')).toEqual([JSON.stringify(['green-path', 'sevault-canyon'])]);
  expect(screen.getByRole('checkbox', { name: 'green-path' })).toBeChecked();
  fireEvent.click(screen.getByRole('checkbox', { name: 'green-path' }));
  expect(container.querySelector('#green-path')).not.toHaveClass('highlighted');
  expect(container.querySelector('#sevault-canyon')).toHaveClass('highlighted');
  fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
  expect(window.location.search).toBe('?other=kept');
  expect(container.querySelector('.highlighted')).toBeNull();
  expect(screen.getByRole('checkbox', { name: 'sevault-canyon' })).not.toBeChecked();
  expect(screen.getByRole('button', { name: 'Clear all' })).toBeDisabled();
  window.history.replaceState(null, '', '/?location=green-path');
  fireEvent.popState(window);
  expect(container.querySelector('#green-path')).toHaveClass('highlighted');
  window.history.replaceState(null, '', '/?location=unknown');
  fireEvent.popState(window);
  expect(container.querySelector('.highlighted')).toBeNull();
  expect(screen.getByLabelText('Map zoom')).toHaveTextContent('100%');
});

it('updates selection without navigation events or replacing the scrolling list', () => {
  const navigation = vi.fn();
  window.addEventListener('popstate', navigation);
  try {
    render(<>
      <LocationList regionName="Kanto" ids={['green-path', 'sevault-canyon']} locations={[]} />
      <MapViewport><svg><path id="green-path" /><path id="sevault-canyon" /></svg></MapViewport>
    </>);
    const list = screen.getByRole('complementary');
    list.scrollTop = 180;
    fireEvent.click(screen.getByRole('checkbox', { name: 'green-path' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'sevault-canyon' }));
    expect(screen.getByRole('complementary')).toBe(list);
    expect(list.scrollTop).toBe(180);
    expect(screen.getByRole('checkbox', { name: 'green-path' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'sevault-canyon' })).toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(list.scrollTop).toBe(180);
    expect(navigation).not.toHaveBeenCalled();
  } finally {
    window.removeEventListener('popstate', navigation);
  }
});

it('restores multiple locations from a direct URL', () => {
  window.history.replaceState(null, '', `/?${new URLSearchParams({ location: JSON.stringify(['green-path', 'sevault-canyon']) })}`);
  const { container } = render(<MapViewport><svg><path id="green-path" /><path id="sevault-canyon" /></svg></MapViewport>);
  expect(container.querySelector('#green-path')).toHaveClass('highlighted');
  expect(container.querySelector('#sevault-canyon')).toHaveClass('highlighted');
});

it('includes artwork in server output before hydration', () => {
  expect(renderToString(<MapViewport><svg role="img" aria-label="Kanto" /></MapViewport>))
    .toContain('aria-label="Kanto"');
});

it('zooms within limits and restores the initial view', () => {
  render(<MapViewport><svg role="img" aria-label="Kanto" /></MapViewport>);
  expect(screen.getByRole('button', { name: 'Zoom out' })).toBeDisabled();
  const zoomIn = screen.getByRole('button', { name: 'Zoom in' });
  fireEvent.click(zoomIn);
  expect(screen.getByLabelText('Map zoom')).toHaveTextContent('150%');
  for (let i = 0; i < 20; i++) fireEvent.click(zoomIn);
  expect(screen.getByLabelText('Map zoom')).toHaveTextContent('1600%');
  expect(zoomIn).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Fit map' }));
  expect(screen.getByLabelText('Map zoom')).toHaveTextContent('100%');
  expect(screen.getByRole('img', { name: 'Kanto' })).toBeInTheDocument();
});

it('uses predictable button stops and reverses them', () => {
  render(<MapViewport><svg role="img" aria-label="Kanto" /></MapViewport>);
  const zoomIn = screen.getByRole('button', { name: 'Zoom in' });
  const zoomOut = screen.getByRole('button', { name: 'Zoom out' });
  for (const percentage of [150, 200, 300, 400, 600, 800, 1200, 1600]) {
    fireEvent.click(zoomIn);
    expect(screen.getByLabelText('Map zoom')).toHaveTextContent(`${percentage}%`);
  }
  for (const percentage of [1200, 800, 600, 400, 300, 200, 150, 100]) {
    fireEvent.click(zoomOut);
    expect(screen.getByLabelText('Map zoom')).toHaveTextContent(`${percentage}%`);
  }
});

it('responds to small trackpad pinch deltas and snaps the next button step', () => {
  const { container } = render(<MapViewport><svg /></MapViewport>);
  const viewport = container.querySelector('.touch-none')!;
  fireEvent.wheel(viewport, { deltaY: -10, ctrlKey: true });
  expect(screen.getByLabelText('Map zoom')).toHaveTextContent('113%');
  fireEvent.wheel(viewport, { deltaY: 10, ctrlKey: true });
  expect(screen.getByLabelText('Map zoom')).toHaveTextContent('100%');
  fireEvent.wheel(viewport, { deltaY: -10, ctrlKey: true });
  fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
  expect(screen.getByLabelText('Map zoom')).toHaveTextContent('150%');
});

it('selects clicked map locations while preserving query parameters and ignores drags', () => {
  vi.stubGlobal('PointerEvent', MouseEvent);
  const capture = vi.fn();
  window.history.replaceState(null, '', '/?other=kept');
  const { container } = render(
    <MapViewport>
      <svg>
        <g id="Cities"><g id="pallet-town"><path data-testid="city" /></g></g>
        <g id="Routes"><path id="kanto-route-1" data-testid="route" /></g>
        <g id="POI"><path id="viridian-forest" data-testid="poi" /></g>
      </svg>
    </MapViewport>,
  );
  const viewport = container.querySelector('.touch-none')!;
  Object.defineProperty(viewport, 'setPointerCapture', { value: capture });
  try {
    const selected: string[] = [];
    for (const [testId, id] of [['city', 'pallet-town'], ['route', 'kanto-route-1'], ['poi', 'viridian-forest']]) {
      fireEvent.pointerDown(screen.getByTestId(testId), { button: 0, clientX: 20, clientY: 20 });
      // Pointer capture retargets the release to the viewport.
      fireEvent.pointerUp(viewport, { clientX: 20, clientY: 20 });
      selected.push(id);
      expect(new URLSearchParams(window.location.search).getAll('location')).toEqual([JSON.stringify(selected)]);
      expect(new URLSearchParams(window.location.search).get('other')).toBe('kept');
      expect(container.querySelector(`[id="${id}"]`)).toHaveClass('highlighted');
    }
    fireEvent.pointerDown(screen.getByTestId('city'), { button: 0, clientX: 20, clientY: 20 });
    fireEvent.pointerMove(viewport, { clientX: 60, clientY: 20 });
    fireEvent.pointerUp(viewport, { clientX: 20, clientY: 20 });
    expect(new URLSearchParams(window.location.search).get('location')).toBe(JSON.stringify(['pallet-town', 'kanto-route-1', 'viridian-forest']));
    fireEvent.pointerDown(screen.getByTestId('city'), { button: 0, clientX: 20, clientY: 20 });
    fireEvent.pointerCancel(viewport);
    fireEvent.pointerUp(viewport, { clientX: 20, clientY: 20 });
    expect(new URLSearchParams(window.location.search).get('location')).toBe(JSON.stringify(['pallet-town', 'kanto-route-1', 'viridian-forest']));
  } finally {
    vi.unstubAllGlobals();
  }
});
