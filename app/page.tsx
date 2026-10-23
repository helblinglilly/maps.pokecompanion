import Link from "vinext/shims/link";
import regions from "./lib/map-catalog.json";

export const dynamic = "force-static";

export default function Home() {
  return (
    <div className="grid gap-8">
      <h1 className="text-2xl font-bold">Pokécompanion's Maps</h1>
      <nav aria-label="Region maps" className="grid gap-8">
        {regions.map((region) => (
          <section key={region.id} className="grid gap-4">
            <h2 className="text-xl font-semibold">{region.name}</h2>
            <div className="grid gap-4 pl-8">
              {region.groups.map((group) => (
                <h3 key={group.slug}>
                  {group.file ? (
                    <Link className="underline" href={`/${region.slug}/${group.slug}`}>
                      {group.name}
                    </Link>
                  ) : (
                    <span role="link" aria-disabled="true" className="opacity-40">
                      {group.name} — Missing map
                    </span>
                  )}
                </h3>
              ))}
            </div>
          </section>
        ))}
      </nav>
    </div>
  );
}
