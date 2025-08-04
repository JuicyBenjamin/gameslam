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
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Gamepad2, Users, Palette, Trophy, Star, ExternalLink, User, Folder } from 'lucide-react'

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Gamepad2 className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Welcome to <span className="text-primary">GameSlam</span>
            </h1>

            {!isLoggedIn ? (
              <>
                <p className="mb-8 text-xl text-muted-foreground leading-relaxed">
                  Where game developers come together to create, compete, and celebrate the art of game development.
                  Join our vibrant community of creators and bring your game ideas to life!
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button asChild size="lg" className="text-lg">
                    <a href="/slams">
                      <Trophy className="mr-2 h-5 w-5" />
                      Explore Slams
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg bg-transparent">
                    <a href="/sign-up">
                      <Users className="mr-2 h-5 w-5" />
                      Join Now
                    </a>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-8 text-xl text-muted-foreground leading-relaxed">
                  Welcome back! Ready to create something amazing today?
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button asChild size="lg" className="text-lg">
                    <a href="/slams">
                      <Trophy className="mr-2 h-5 w-5" />
                      View Slams
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg bg-transparent">
                    <a href="/slams/create">
                      <Gamepad2 className="mr-2 h-5 w-5" />
                      Create Slam
                    </a>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Slams Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">Featured Slams</h2>
            <p className="text-lg text-muted-foreground">Join exciting competitions and showcase your skills</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredContent.slams.map((slamData: any) => (
              <Card
                key={slamData.slam.id}
                className="group h-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-lg">{slamData.slam.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{slamData.slam.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto flex items-center justify-between">
                  <Badge variant="secondary" className="gap-1">
                    <Users className="h-3 w-3" />
                    {slamData.entryCount} entries
                  </Badge>
                  <Button asChild size="sm">
                    <a href={`/slams/show/${slamData.slam.id}`}>View Slam</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Artists Section */}
      <section className="bg-muted/30 py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">Top Artists</h2>
            <p className="text-lg text-muted-foreground">Discover talented creators in our community</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredContent.artists.map((artist: any) => (
              <Card
                key={artist.id}
                className="group h-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{artist.name}</CardTitle>
                  <CardDescription>{artist.assetCount} assets listed</CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between">
                  <Badge variant="outline" className="gap-1">
                    <Folder className="h-3 w-3" />
                    {artist.assetCount} assets
                  </Badge>
                  <Button asChild size="sm">
                    <a href={`/artists/${artist.name}`}>View Profile</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Assets Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">Featured Assets</h2>
            <p className="text-lg text-muted-foreground">High-quality resources for your game projects</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredContent.assets.map((asset: any) => (
              <Card key={asset.id} className="group h-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                    <Palette className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">{asset.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{asset.name}</CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between">
                  <Badge variant="secondary">Asset</Badge>
                  <Button asChild size="sm">
                    <a href={asset.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      View Asset
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Entries Section */}
      <section className="bg-muted/30 py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">Latest Entries</h2>
            <p className="text-lg text-muted-foreground">Fresh submissions from our creative community</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredContent.entries.map((entry: any) => (
              <Card key={entry.id} className="group h-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{entry.name}</h3>
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                    {entry.description || "No description provided"}
                  </p>
                  <p className="mb-4 text-xs text-muted-foreground">By {entry.userName}</p>
                  <Button asChild size="sm" className="w-full">
                    <a href={entry.linkToEntry} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      View Entry
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section - Only show if not logged in */}
      {!isLoggedIn && (
        <section className="bg-gradient-to-r from-primary to-primary/80 py-20 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold text-primary-foreground lg:text-4xl">
              Ready to Start Your Game Development Journey?
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-lg text-primary-foreground/90 lg:text-xl">
              Join GameSlam today and be part of a community that celebrates creativity and innovation in game
              development.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <a href="/sign-up">
                <Users className="mr-2 h-5 w-5" />
                Create Your Account
              </a>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}