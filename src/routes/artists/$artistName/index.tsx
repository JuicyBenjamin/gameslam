import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ExternalLink, Package, Trophy, Users, Calendar, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { artistsCollection } from '~/collections'
import { fetchArtistProfile } from '~/server-functions/artist-profile'

// Mock function for date formatting
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const Route = createFileRoute('/artists/$artistName/')({
  component: ArtistProfile,
  loader: async ({ params }) => {
    // This runs on the server and provides data for SSR
    try {
      const profileData = await fetchArtistProfile({ data: { artistName: params.artistName } } as any)
      console.log('Artist profile loader data:', profileData)
      return profileData
    } catch (error) {
      console.error('Artist profile loader error:', error)
      throw error
    }
  },
})

function ArtistProfile() {
  const { artistName } = Route.useParams()
  const loaderData = Route.useLoaderData()

  // Find the artist from the collection
  const { data: artists = [] } = useLiveQuery((q) =>
    q
      .from({ artist: artistsCollection })
      .where(({ artist }) => eq(artist.artist.name, artistName)),
  )

  // Use loader data (collection will update reactively on client)
  const profileData = loaderData

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading artist profile...</p>
        </div>
      </div>
    )
  }

  const { artist, assets, slams } = profileData

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header Section */}
      <div className="bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left">
            {/* Avatar */}
            <Avatar className="mb-4 h-24 w-24 md:mb-0 md:mr-6">
              <AvatarImage src="/placeholder.svg" alt={artist.name} />
              <AvatarFallback className="text-2xl">
                {artist.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>

            {/* Artist Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">{artist.name}</h1>
              <p className="mt-2 text-lg text-muted-foreground">Game Developer</p>
              {artist.link && (
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm">
                    <a href={artist.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Website
                    </a>
                  </Button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 md:mt-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{assets.length}</div>
                <div className="text-sm text-muted-foreground">Assets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{slams.length}</div>
                <div className="text-sm text-muted-foreground">Slams</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Assets Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Assets</h2>
            <Badge variant="secondary">{assets.length} assets</Badge>
          </div>

          {assets.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {assets.map((asset: any) => (
                <Card key={asset.id} className="group h-full transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="line-clamp-2">{asset.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {asset.itchData?.description || asset.description || 'No description available'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-medium">{asset.itchData?.price || 'Free'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Downloads</span>
                        <span className="font-medium">{asset.itchData?.downloads || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Rating</span>
                        <div className="flex items-center">
                          <span className="font-medium">{asset.itchData?.rating || 0}</span>
                          <span className="ml-1 text-yellow-500">★</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent className="pt-0">
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <a href={asset.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Asset
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No assets yet</h3>
              <p className="text-muted-foreground">This artist hasn't uploaded any assets yet.</p>
            </div>
          )}
        </section>

        {/* Slams Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Created Slams</h2>
            <Badge variant="secondary">{slams.length} slams</Badge>
          </div>

          {slams.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {slams.map((slam: any) => (
                <Card key={slam.id} className="group h-full transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{slam.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{slam.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Created</span>
                        <span className="font-medium">{formatDate(slam.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant={slam.status === 'active' ? 'default' : 'secondary'}>{slam.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent className="pt-0">
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <Link to="/slams/show/$id" params={{ id: slam.id }}>
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        View Slam
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No slams created yet</h3>
              <p className="text-muted-foreground">This artist hasn't created any slams yet.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
