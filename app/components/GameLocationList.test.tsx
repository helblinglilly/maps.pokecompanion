import { render, screen, within } from '@testing-library/react';
import { expect, it } from 'vitest';
import { GameLocationList } from './GameLocationList';

it('shows version-group coverage and lists excluded locations last with their explanation', () => {
  const { container, rerender } = render(<GameLocationList regionSlug="kanto" regionName="Kanto" group={{ slug: 'red-blue', name: 'Red / Blue' }}
    ids={['pallet-town']} locations={['pallet-town', 'one-island'].map(name => ({ name, url: `https://pokeapi.co/${name}` }))} />);
  expect(screen.getByText(/1 of 1 applicable locations matched.*100%/)).toBeInTheDocument();
  const excluded = screen.getByRole('region', { name: 'Excluded locations (1)' });
  expect(within(excluded).getByText('one-island')).toBeInTheDocument();
  expect(within(excluded).getByText(/Sevii Islands/)).toBeInTheDocument();
  expect(screen.getByText(/matched for Pokémon Red \/ Blue/)).toBeInTheDocument();
  expect(container.querySelector('aside')?.lastElementChild).toBe(excluded);
  expect(screen.getByRole('heading', { name: 'Missing from Map (0)' })).toBeInTheDocument();
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  rerender(<GameLocationList regionSlug="kanto" regionName="Kanto" group={{ slug: 'firered-leafgreen', name: 'FireRed / LeafGreen' }}
    ids={['pallet-town']} locations={['pallet-town', 'one-island'].map(name => ({ name, url: `https://pokeapi.co/${name}` }))} />);
  expect(screen.queryByRole('region', { name: 'Excluded locations (1)' })).not.toBeInTheDocument();
  expect(screen.getByText(/1 of 2 applicable locations matched.*50%/)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Missing from Map (1)' })).toBeInTheDocument();
});
