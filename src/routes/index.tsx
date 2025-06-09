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
    <div class="flex flex-col gap-16">
      {/* Hero Section */}
      <section class="hero min-h-[80vh] bg-base-200">
        <div class="hero-content text-center">
          <div class="max-w-3xl">
            <h1 class="text-5xl font-bold">Welcome to GameSlam</h1>
            {!isLoggedIn ? (
              <>
                <p class="py-6 text-xl">
                  Where game developers come together to create, compete, and
                  celebrate the art of game development. Join our vibrant
                  community of creators and bring your game ideas to life!
                </p>
                <div class="flex justify-center gap-4">
                  <Link href="/slams" class="btn btn-primary">
                    Explore Slams
                  </Link>
                  <Link href="/sign-up" class="btn btn-outline">
                    Join Now
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p class="py-6 text-xl">
                  Welcome back, {user.value.name}! Ready to create something
                  amazing today?
                </p>
                <div class="flex justify-center gap-4">
                  <Link href="/slams" class="btn btn-primary">
                    View Slams
                  </Link>
                  <Link href="/slams/create" class="btn btn-outline">
                    Create Slam
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Content Carousels */}
      <section class="container mx-auto px-4">
        <div class="flex flex-col gap-12">
          {/* Featured Slams Carousel */}
          <div>
            <h2 class="mb-6 text-2xl font-bold">Featured Slams</h2>
            <div class="carousel carousel-center w-full space-x-4 rounded-box bg-base-200 p-4">
              {featuredContent.value.slams.map((slam) => (
                <div key={slam.id} class="carousel-item">
                  <Link
                    href={`/slams/show/${slam.id}`}
                    class="card w-80 bg-base-100 shadow-xl"
                  >
                    <div class="card-body">
                      <h3 class="card-title">{slam.name}</h3>
                      <p class="line-clamp-2">{slam.description}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Artists Carousel */}
          <div>
            <h2 class="mb-6 text-2xl font-bold">Top Artists</h2>
            <div class="carousel carousel-center w-full space-x-4 rounded-box bg-base-200 p-4">
              {featuredContent.value.artists.map((artist) => (
                <div key={artist.id} class="carousel-item">
                  <Link
                    href={`/artists/${artist.name}`}
                    class="card w-80 bg-base-100 shadow-xl"
                  >
                    <div class="card-body">
                      <h3 class="card-title">{artist.name}</h3>
                      <p>{artist.assetCount} assets created</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Assets Carousel */}
          <div>
            <h2 class="mb-6 text-2xl font-bold">Featured Assets</h2>
            <div class="carousel carousel-center w-full space-x-4 rounded-box bg-base-200 p-4">
              {featuredContent.value.assets.map((asset) => (
                <div key={asset.id} class="carousel-item">
                  <a
                    href={asset.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="card w-80 bg-base-100 shadow-xl"
                  >
                    <div class="card-body">
                      <h3 class="card-title">{asset.name}</h3>
                      <p class="line-clamp-2">{asset.name}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Entries Carousel */}
          <div>
            <h2 class="mb-6 text-2xl font-bold">Latest Entries</h2>
            <div class="carousel carousel-center w-full space-x-4 rounded-box bg-base-200 p-4">
              {featuredContent.value.entries.map((entry) => (
                <div key={entry.id} class="carousel-item">
                  <a
                    href={entry.linkToEntry}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="card w-80 bg-base-100 shadow-xl"
                  >
                    <div class="card-body">
                      <h3 class="card-title">{entry.name}</h3>
                      <p class="line-clamp-2">{entry.description}</p>
                      <div class="mt-2 text-sm text-gray-600">
                        By {entry.userName}
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Only show if not logged in */}
      {!isLoggedIn && (
        <section class="bg-primary text-primary-content">
          <div class="container mx-auto px-4 py-16 text-center">
            <h2 class="mb-4 text-3xl font-bold">
              Ready to Start Your Game Development Journey?
            </h2>
            <p class="mb-8 text-lg">
              Join GameSlam today and be part of a community that celebrates
              creativity and innovation in game development.
            </p>
            <Link href="/sign-up" class="btn btn-secondary btn-lg">
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
