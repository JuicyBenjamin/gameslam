import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Palette, ExternalLink, Package, Trophy, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLiveQuery } from '@tanstack/react-db'
import { artistsCollection } from '~/collections'

export const Route = createFileRoute('/artists/')({
  component: Artists,
})

function Artists() {
  const { data: artists = [] } = useLiveQuery(query =>
    query.from({ artistItem: artistsCollection }).orderBy(({ artistItem }) => artistItem.artist.name, 'asc'),
  )

  const getSpecialtyColor = (specialty: string) => {
    const colors = {
      '2D Art': 'bg-primary/10 text-primary',
      'Game Dev': 'bg-primary/20 text-primary',
      Audio: 'bg-accent/10 text-accent-foreground',
      '3D Art': 'bg-accent/20 text-accent-foreground',
      'UI/UX': 'bg-primary/15 text-primary',
      Programming: 'bg-accent/15 text-accent-foreground',
    }
    return colors[specialty as keyof typeof colors] || 'bg-muted text-muted-foreground'
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
          {artists.map(item => {
            const artist = item.artist
            const assetCount = Number(item.assetCount)

            return (
              <Card
                key={artist.id}
                className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col"
              >
                <Link to={`/artists/${artist.name}` as any} className="h-full flex flex-col">
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
                        <span className="font-medium">{assetCount}</span>
                        <span>assets</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        <span className="font-medium">0</span>
                        <span>slams</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                  </CardFooter>
                </Link>
              </Card>
            )
          })}
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
