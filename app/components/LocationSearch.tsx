export function LocationSearch({ query, onQueryChange }: {
  query: string;
  onQueryChange: (query: string) => void;
}) {
  return (
    <div className="mt-3">
      <label htmlFor="location-search" className="mb-1 block text-xs font-semibold">
        Search locations
      </label>
      <div className="flex gap-2">
        <input
          id="location-search"
          type="search"
          value={query}
          onChange={event => onQueryChange(event.target.value)}
          placeholder="Search map elements and locations…"
          className="min-w-0 flex-1 rounded border border-[#d7dfd5] px-3 py-2 text-sm focus:outline-2 focus:outline-green-700"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="rounded border border-[#d7dfd5] px-3 py-2 text-sm hover:bg-slate-100"
          >
            Clear search
          </button>
        )}
      </div>
    </div>
  );
}
