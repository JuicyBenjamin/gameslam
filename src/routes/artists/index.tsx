import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Link } from '@tanstack/react-router'
import { Palette, ExternalLink, Package, Trophy, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { db, logQuery, printQueryStats } from '~/db/logger'
import { artists } from '~/db/schema/artists'
import { artistAssets } from '~/db/schema/artistAssets'
import { slams } from '~/db/schema/slams'
import { count } from 'drizzle-orm'

// Server function for fetching artists data (SSR)
const fetchArtists = createServerFn({ method: 'GET' }).handler(async () => {
  console.log('Fetching artists on server...')

  try {
    // Get all artists
    const artistsData = await logQuery('getAllArtists', async () => {
      return await db.select().from(artists)
    })

    // Get asset counts for each artist
    const assetCounts = await logQuery('getArtistAssetCounts', async () => {
      return await db
        .select({
          artistId: artistAssets.artistId,
          count: count(artistAssets.assetId),
        })
        .from(artistAssets)
        .groupBy(artistAssets.artistId)
    })

    // Get slam counts for each artist
    const slamCounts = await logQuery('getArtistSlamCounts', async () => {
      return await db
        .select({
          artistId: slams.artistId,
          count: count(slams.id),
        })
        .from(slams)
        .groupBy(slams.artistId)
    })

    // Combine the data
    const artistsWithCounts = artistsData.map(artist => {
      const assetCount = assetCounts.find(ac => ac.artistId === artist.id)?.count ?? 0
      const slamCount = slamCounts.find(sc => sc.artistId === artist.id)?.count ?? 0
      return {
        ...artist,
        assetCount: Number(assetCount),
        slamCount: Number(slamCount),
      }
    })

    // Print statistics at the end of this request
    printQueryStats()

    return artistsWithCounts
  } catch (error) {
    console.error('Error fetching artists:', error)
    throw error
  }
})

export const Route = createFileRoute('/artists/')({
  component: Artists,
  loader: async () => {
    // This runs on the server and provides data for SSR
    try {
      const artists = await fetchArtists()
      console.log('Artists loader data:', artists)
      return { artists }
    } catch (error) {
      console.error('Artists loader error:', error)
      throw error
    }
  },
})

export default function Artists() {
  const { artists } = Route.useLoaderData()

  const getSpecialtyColor = (specialty: string) => {
    const colors = {
      '2D Art': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'Game Dev': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      Audio: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      '3D Art': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'UI/UX': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      Programming: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    }
    return colors[specialty as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Artists</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            Discover talented creators in our game development community
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist: any) => (
            <Card
              key={artist.id}
              className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col"
            >
              <Link to={`/artists/${artist.name}`} className="h-full flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={artist.avatar || '/placeholder.svg'} alt={artist.name} />
                      <AvatarFallback>
                        {artist.name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors flex items-center gap-2">
                        <Palette className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{artist.name}</span>
                      </CardTitle>
                      <div className="mt-1">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getSpecialtyColor(artist.specialty || 'Game Dev')}`}
                        >
                          {artist.specialty || 'Game Dev'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 flex-grow">
                  {/* Bio */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {artist.bio || 'Passionate game developer and creative professional.'}
                  </p>

                  {/* Website Link */}
                  {artist.link && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <ExternalLink className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate font-medium hover:text-primary transition-colors">
                        {artist.link.replace('https://', '')}
                      </span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span className="font-medium">{artist.assetCount}</span>
                      <span>assets</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      <span className="font-medium">{artist.slamCount}</span>
                      <span>slams</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                  >
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {artists.length === 0 && (
          <div className="text-center py-12">
            <Palette className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No artists yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Artists will appear here as they join and participate in game slams.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
