import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { db } from "~/db";
import { artists } from "~/db/schema/artists";
import { assets } from "~/db/schema/assets";
import { artistAssets } from "~/db/schema/artistAssets";
import { slams } from "~/db/schema/slams";
import { eq } from "drizzle-orm";

export const useArtistProfile = routeLoader$(async (requestEvent) => {
  const artistName = requestEvent.params.artistName;

  // Get artist by name
  const artistData = await db
    .select()
    .from(artists)
    .where(eq(artists.name, artistName))
    .limit(1);

  if (artistData.length === 0) {
    throw requestEvent.error(404, "Artist not found");
  }

  const artist = artistData[0];

  // Get assets created by the artist through the join table
  const artistAssetsData = await db
    .select({
      asset: assets,
    })
    .from(artistAssets)
    .innerJoin(assets, eq(artistAssets.assetId, assets.id))
    .where(eq(artistAssets.artistId, artist.id));

  // Get slams that use the artist's assets
  const slamsData = await db
    .select({
      slam: slams,
      asset: assets,
    })
    .from(slams)
    .innerJoin(assets, eq(slams.assetId, assets.id))
    .where(eq(slams.artistId, artist.id));

  return {
    artist,
    assets: artistAssetsData.map((a) => a.asset),
    slams: slamsData.map((s) => ({
      ...s.slam,
      asset: s.asset,
    })),
  };
});

export default component$(() => {
  const artistProfile = useArtistProfile();

  return (
    <div class="container mx-auto px-4 py-8">
      <Link
        href="/artists"
        class="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-white transition duration-300 hover:bg-white/20"
      >
        ← Back to Artists
      </Link>
      <div class="mb-8">
        <div class="flex items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold">
              {artistProfile.value.artist.name}
            </h1>
            <a
              href={artistProfile.value.artist.link}
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500 hover:underline"
            >
              Visit itch.io page
            </a>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 class="mb-4 text-2xl font-bold">Assets</h2>
          {artistProfile.value.assets.length === 0 ? (
            <p class="text-gray-500">No assets found</p>
          ) : (
            <div class="space-y-4">
              {artistProfile.value.assets.map((asset) => (
                <a
                  key={asset.id}
                  href={asset.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block rounded-lg border p-4 transition-colors hover:border-blue-500"
                >
                  <h3 class="text-xl font-semibold">{asset.name}</h3>
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 class="mb-4 text-2xl font-bold">Slams Using Assets</h2>
          {artistProfile.value.slams.length === 0 ? (
            <p class="text-gray-500">No slams found using these assets</p>
          ) : (
            <div class="space-y-4">
              {artistProfile.value.slams.map((slam) => (
                <Link
                  key={slam.id}
                  href={`/slams/show/${slam.id}`}
                  class="block rounded-lg border p-4 transition-colors hover:border-blue-500"
                >
                  <h3 class="text-xl font-semibold">{slam.name}</h3>
                  <p class="mt-2 text-gray-600">{slam.description}</p>
                  <p class="mt-2 text-sm text-gray-500">
                    Using asset: {slam.asset.name}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
