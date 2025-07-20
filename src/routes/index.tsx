export const prerender = false;

import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { useCurrentUser } from "~/loaders/auth";
import { getAllSlams } from "~/db/queries/slams";
import { db } from "~/db";
import { artists } from "~/db/schema/artists";
import { assets } from "~/db/schema/assets";
import { artistAssets } from "~/db/schema/artistAssets";
import { slamEntries } from "~/db/schema/slamEntries";
import { users } from "~/db/schema/users";
import { count, eq } from "drizzle-orm";

export const useFeaturedContent = routeLoader$(async () => {
  // Get top 5 slams
  const topSlams = await getAllSlams().then((slams) => slams.slice(0, 5));

  // Get top 5 artists with their asset counts
  const topArtists = await db
    .select({
      artist: artists,
      assetCount: count(artistAssets.assetId),
    })
    .from(artists)
    .leftJoin(artistAssets, eq(artistAssets.artistId, artists.id))
    .groupBy(artists.id)
    .orderBy(count(artistAssets.assetId))
    .limit(5);

  // Get top 5 assets
  const topAssets = await db.select().from(assets).limit(5);

  // Get top 5 entries with user information
  const topEntries = await db
    .select({
      entry: slamEntries,
      user: users,
    })
    .from(slamEntries)
    .leftJoin(users, eq(slamEntries.userId, users.id))
    .limit(5);

  return {
    slams: topSlams,
    artists: topArtists.map((a) => ({
      ...a.artist,
      assetCount: Number(a.assetCount),
    })),
    assets: topAssets,
    entries: topEntries.map((e) => ({
      ...e.entry,
      userName: e.user?.name,
    })),
  };
});

export default component$(() => {
  const user = useCurrentUser();
  const isLoggedIn = user.value != null;
  const featuredContent = useFeaturedContent();

  return (
    <div class="min-h-screen">
      {/* Hero Section */}
      <div class="hero bg-base-200 min-h-screen">
        <div class="hero-content text-center">
          <div class="max-w-4xl">
            <h1 class="text-base-content mb-6 text-5xl font-bold">
              Welcome to GameSlam
            </h1>
            {!isLoggedIn ? (
              <>
                <p class="text-base-content/80 mb-8 text-xl leading-relaxed">
                  Where game developers come together to create, compete, and
                  celebrate the art of game development. Join our vibrant
                  community of creators and bring your game ideas to life!
                </p>
                <div class="flex flex-col justify-center gap-4 sm:flex-row">
                  <Link href="/slams" class="btn btn-primary btn-lg">
                    Explore Slams
                  </Link>
                  <Link href="/sign-up" class="btn btn-outline btn-lg">
                    Join Now
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p class="text-base-content/80 mb-8 text-xl leading-relaxed">
                  Welcome back, {user.value.name}! Ready to create something
                  amazing today?
                </p>
                <div class="flex flex-col justify-center gap-4 sm:flex-row">
                  <Link href="/slams" class="btn btn-primary btn-lg">
                    View Slams
                  </Link>
                  <Link href="/slams/create" class="btn btn-outline btn-lg">
                    Create Slam
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Featured Slams Section */}
      <section class="bg-base-100 py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-base-content mb-8 text-3xl font-bold">
            Featured Slams
          </h2>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredContent.value.slams.map((slamData) => (
              <Link
                key={slamData.slam.id}
                href={`/slams/show/${slamData.slam.id}`}
                class="h-full"
              >
                <div class="card bg-base-200 h-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div class="card-body">
                    <h3 class="card-title text-base-content mb-3 text-lg leading-tight">
                      {slamData.slam.name}
                    </h3>
                    <p class="text-base-content/70 mb-4 line-clamp-2 text-sm">
                      {slamData.slam.description}
                    </p>
                    <div class="mt-auto flex items-center justify-between">
                      <div class="badge badge-outline badge-primary text-xs">
                        {slamData.entryCount} entries
                      </div>
                      <span class="btn btn-primary btn-sm">View Slam</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Artists Section */}
      <section class="bg-base-200 py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-base-content mb-8 text-3xl font-bold">Top Artists</h2>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredContent.value.artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.name}`}
                class="h-full"
              >
                <div class="card bg-base-100 h-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div class="card-body">
                    <h3 class="card-title text-base-content mb-3 text-lg leading-tight">
                      {artist.name}
                    </h3>
                    <p class="text-base-content/70 mb-4 text-sm">
                      {artist.assetCount} assets listed
                    </p>
                    <div class="card-actions mt-auto items-center justify-between">
                      <div class="badge badge-outline badge-primary text-xs">
                        <svg
                          class="mr-1 h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        {artist.assetCount} assets
                      </div>
                      <span class="btn btn-primary btn-sm">View Profile</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Assets Section */}
      <section class="bg-base-100 py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-base-content mb-8 text-3xl font-bold">
            Featured Assets
          </h2>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredContent.value.assets.map((asset) => (
              <a
                key={asset.id}
                href={asset.link}
                target="_blank"
                rel="noopener noreferrer"
                class="h-full"
              >
                <div class="card bg-base-200 h-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div class="card-body">
                    <h3 class="card-title text-base-content mb-3 text-lg leading-tight">
                      {asset.name}
                    </h3>
                    <p class="text-base-content/70 mb-4 line-clamp-2 text-sm">
                      {asset.name}
                    </p>
                    <div class="mt-auto flex items-center justify-between">
                      <div class="badge badge-outline badge-secondary text-xs">
                        Asset
                      </div>
                      <span class="btn btn-primary btn-sm">View Asset</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Entries Section */}
      <section class="bg-base-200 py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-base-content mb-8 text-3xl font-bold">
            Latest Entries
          </h2>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredContent.value.entries.map((entry) => (
              <a
                key={entry.id}
                href={entry.linkToEntry}
                target="_blank"
                rel="noopener noreferrer"
                class="h-full"
              >
                <div class="card bg-base-100 h-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div class="card-body p-4">
                    <h3 class="card-title text-base-content mb-2 text-sm leading-tight">
                      {entry.name}
                    </h3>
                    <p class="text-base-content/70 mb-2 line-clamp-2 text-xs">
                      {entry.description || "No description provided"}
                    </p>
                    <p class="text-base-content/50 text-xs">
                      By {entry.userName}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section - Only show if not logged in */}
      {!isLoggedIn && (
        <section class="from-primary to-secondary bg-gradient-to-r py-20">
          <div class="container mx-auto px-4 text-center">
            <h2 class="text-primary-content mb-6 text-4xl font-bold">
              Ready to Start Your Game Development Journey?
            </h2>
            <p class="text-primary-content/90 mx-auto mb-8 max-w-3xl text-xl">
              Join GameSlam today and be part of a community that celebrates
              creativity and innovation in game development.
            </p>
            <Link href="/sign-up" class="btn btn-accent btn-lg">
              Create Your Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "GameSlam - Where Game Developers Create and Compete",
  meta: [
    {
      name: "description",
      content:
        "Join GameSlam, the premier platform for game developers to create, compete, and showcase their work. Participate in game jams, connect with artists, and be part of a vibrant community.",
    },
  ],
};
