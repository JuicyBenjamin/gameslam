import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import React from 'react'
import { getAllSlams } from '../db/queries/slams'
import { printQueryStats, logQuery } from '../db/logger'
import { db } from '../db/logger'
import { artists } from '../db/schema/artists'
import { assets } from '../db/schema/assets'
import { artistAssets } from '../db/schema/artistAssets'
import { slamEntries } from '../db/schema/slamEntries'
import { users } from '../db/schema/users'
import { count, eq } from 'drizzle-orm'
import { getCurrentUser } from '../loaders/auth'

// Server function for fetching featured content (SSR)
const fetchFeaturedContent = createServerFn({ method: 'GET' }).handler(async () => {
  console.log('Fetching featured content on server...')

  try {
    // Get top 5 slams
    const topSlams = await getAllSlams().then((slams) => slams.slice(0, 5))

    // Get top 5 artists with their asset counts
    const topArtists = await logQuery("getTopArtists", async () => {
      return await db
        .select({
          artist: artists,
          assetCount: count(artistAssets.assetId),
        })
        .from(artists)
        .leftJoin(artistAssets, eq(artistAssets.artistId, artists.id))
        .groupBy(artists.id)
        .orderBy(count(artistAssets.assetId))
        .limit(5)
    })

    // Get top 5 assets
    const topAssets = await logQuery("getTopAssets", async () => {
      return await db.select().from(assets).limit(5)
    })

    // Get top 5 entries with user information
    const topEntries = await logQuery("getTopEntries", async () => {
      return await db
        .select({
          entry: slamEntries,
          user: users,
        })
        .from(slamEntries)
        .leftJoin(users, eq(slamEntries.userId, users.id))
        .limit(5)
    })

    const result = {
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
    }

    // Print statistics at the end of this request
    printQueryStats()

    return result
  } catch (error) {
    console.error('Error fetching featured content:', error)
    throw error
  }
})

export const Route = createFileRoute('/')({
  component: Index,
  loader: async ({ context }) => {
    // This runs on the server and provides data for SSR
    try {
      // Fetch featured content and current user in parallel
      const [featuredContent, user] = await Promise.all([
        fetchFeaturedContent(),
        getCurrentUser()
      ])

      console.log('Loader data:', { featuredContent, user })
      return { featuredContent, user }
    } catch (error) {
      console.error('Loader error:', error)
      throw error
    }
  }
})

function Index() {
  // Get data from the loader (SSR)
  const { featuredContent, user } = Route.useLoaderData()
  const isLoggedIn = user != null

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-base-content mb-6 text-5xl font-bold">
              Welcome to GameSlam
            </h1>
            {!isLoggedIn ? (
              <>
                <p className="text-base-content/80 mb-8 text-xl leading-relaxed">
                  Where game developers come together to create, compete, and
                  celebrate the art of game development. Join our vibrant
                  community of creators and bring your game ideas to life!
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <a href="/slams" className="btn btn-primary btn-lg">
                    Explore Slams
                  </a>
                  <a href="/sign-up" className="btn btn-outline btn-lg">
                    Join Now
                  </a>
                </div>
              </>
            ) : (
              <>
                <p className="text-base-content/80 mb-8 text-xl leading-relaxed">
                  Welcome back! Ready to create something amazing today?
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <a href="/slams" className="btn btn-primary btn-lg">
                    View Slams
                  </a>
                  <a href="/slams/create" className="btn btn-outline btn-lg">
                    Create Slam
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Featured Slams Section */}
      <section className="bg-base-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-base-content mb-8 text-3xl font-bold">
            Featured Slams
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredContent.slams.map((slamData: any) => (
              <a
                key={slamData.slam.id}
                href={`/slams/show/${slamData.slam.id}`}
                className="h-full"
              >
                <div className="card bg-base-200 h-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="card-body">
                    <h3 className="card-title text-base-content mb-3 text-lg leading-tight">
                      {slamData.slam.name}
                    </h3>
                    <p className="text-base-content/70 mb-4 line-clamp-2 text-sm">
                      {slamData.slam.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="badge badge-outline badge-primary text-xs">
                        {slamData.entryCount} entries
                      </div>
                      <span className="btn btn-primary btn-sm">View Slam</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Top Artists Section */}
      <section className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-base-content mb-8 text-3xl font-bold">Top Artists</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredContent.artists.map((artist: any) => (
              <a
                key={artist.id}
                href={`/artists/${artist.name}`}
                className="h-full"
              >
                <div className="card bg-base-100 h-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="card-body">
                    <h3 className="card-title text-base-content mb-3 text-lg leading-tight">
                      {artist.name}
                    </h3>
                    <p className="text-base-content/70 mb-4 text-sm">
                      {artist.assetCount} assets listed
                    </p>
                    <div className="card-actions mt-auto items-center justify-between">
                      <div className="badge badge-outline badge-primary text-xs">
                        <svg
                          className="mr-1 h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        {artist.assetCount} assets
                      </div>
                      <span className="btn btn-primary btn-sm">View Profile</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Assets Section */}
      <section className="bg-base-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-base-content mb-8 text-3xl font-bold">
            Featured Assets
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredContent.assets.map((asset: any) => (
              <a
                key={asset.id}
                href={asset.link}
                target="_blank"
                rel="noopener noreferrer"
                className="h-full"
              >
                <div className="card bg-base-200 h-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="card-body">
                    <h3 className="card-title text-base-content mb-3 text-lg leading-tight">
                      {asset.name}
                    </h3>
                    <p className="text-base-content/70 mb-4 line-clamp-2 text-sm">
                      {asset.name}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="badge badge-outline badge-secondary text-xs">
                        Asset
                      </div>
                      <span className="btn btn-primary btn-sm">View Asset</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Entries Section */}
      <section className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-base-content mb-8 text-3xl font-bold">
            Latest Entries
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredContent.entries.map((entry: any) => (
              <a
                key={entry.id}
                href={entry.linkToEntry}
                target="_blank"
                rel="noopener noreferrer"
                className="h-full"
              >
                <div className="card bg-base-100 h-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="card-body p-4">
                    <h3 className="card-title text-base-content mb-2 text-sm leading-tight">
                      {entry.name}
                    </h3>
                    <p className="text-base-content/70 mb-2 line-clamp-2 text-xs">
                      {entry.description || "No description provided"}
                    </p>
                    <p className="text-base-content/50 text-xs">
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
        <section className="from-primary to-secondary bg-gradient-to-r py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-primary-content mb-6 text-4xl font-bold">
              Ready to Start Your Game Development Journey?
            </h2>
            <p className="text-primary-content/90 mx-auto mb-8 max-w-3xl text-xl">
              Join GameSlam today and be part of a community that celebrates
              creativity and innovation in game development.
            </p>
            <a href="/sign-up" className="btn btn-accent btn-lg">
              Create Your Account
            </a>
          </div>
        </section>
      )}
    </div>
  );
}