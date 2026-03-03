import { useParams, useLoaderData } from '@tanstack/react-router'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { artistsCollection, slamsCollection } from '@/collections'

export const ArtistHeader = () => {
  const { artistName } = useParams({ from: '/artists/$artistName/' })
  const loaderData = useLoaderData({ from: '/artists/$artistName/' })

  const { data: artists = [] } = useLiveQuery(query =>
    query.from({ artistItem: artistsCollection }).where(({ artistItem }) => eq(artistItem.artist.name, artistName)),
  )

  const artistFromCollection = artists[0]
  const artist = artistFromCollection?.artist || loaderData.artist

  if (!artist) return null

  const { data: artistSlams = [] } = useLiveQuery(query =>
    query.from({ slamItem: slamsCollection }).where(({ slamItem }) => eq(slamItem.slam.artistId, artist.id)),
  )

  const assets = artistFromCollection?.assets || loaderData.assets
  const slamsCount = artistSlams.length || loaderData.slams.length

  const initials = artist.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')

  return (
    <div className="bg-card shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left">
          <Avatar className="mb-4 h-24 w-24 md:mb-0 md:mr-6">
            <AvatarImage src="/placeholder.svg" alt={artist.name} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>

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

          <div className="mt-6 grid grid-cols-2 gap-4 md:mt-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{assets.length}</div>
              <div className="text-sm text-muted-foreground">Assets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{slamsCount}</div>
              <div className="text-sm text-muted-foreground">Slams</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
