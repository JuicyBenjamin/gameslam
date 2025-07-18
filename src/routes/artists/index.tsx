import { component$ } from "@qwik.dev/core";
import { Link, routeLoader$ } from "@qwik.dev/router";
import { db } from "~/db";
import { artists } from "~/db/schema/artists";
import { artistAssets } from "~/db/schema/artistAssets";
import { slams } from "~/db/schema/slams";
import { count } from "drizzle-orm";

export const useArtists = routeLoader$(async () => {
  // Get all artists
  const artistsData = await db.select().from(artists);

  // Get asset counts for each artist
  const assetCounts = await db
    .select({
      artistId: artistAssets.artistId,
      count: count(artistAssets.assetId),
    })
    .from(artistAssets)
    .groupBy(artistAssets.artistId);

  // Get slam counts for each artist
  const slamCounts = await db
    .select({
      artistId: slams.artistId,
      count: count(slams.id),
    })
    .from(slams)
    .groupBy(slams.artistId);

  // Combine the data
  const artistsWithCounts = artistsData.map((artist) => {
    const assetCount =
      assetCounts.find((ac) => ac.artistId === artist.id)?.count ?? 0;
    const slamCount =
      slamCounts.find((sc) => sc.artistId === artist.id)?.count ?? 0;
    return {
      ...artist,
      assetCount,
      slamCount,
    };
  });

  return artistsWithCounts;
});

export default component$(() => {
  const artists = useArtists();

  return (
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">Artists</h1>
      </div>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {artists.value.map((artist) => (
          <Link
            key={artist.id}
            href={`/artists/${artist.name}`}
            class="card bg-base-100 shadow-xl transition-transform hover:scale-105"
          >
            <div class="card-body">
              <h2 class="card-title">{artist.name}</h2>
              <div class="mt-4 flex gap-4 text-sm text-gray-600">
                <div>
                  <span class="font-semibold">{artist.assetCount}</span> assets
                </div>
                <div>
                  <span class="font-semibold">{artist.slamCount}</span> slams
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});
