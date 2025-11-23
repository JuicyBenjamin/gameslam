import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Plus, Gamepad2, User, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLiveQuery } from '@tanstack/react-db'
import { slamsCollection } from '~/collections'
import { fetchSlams } from '~/server-functions/slams'

export const Route = createFileRoute('/slams/')({
  component: Slams,
  loader: async () => {
    // This runs on the server and provides data for SSR
    try {
      const slams = await fetchSlams()
      console.log('Slams loader data:', slams)
      return { slams }
    } catch (error) {
      console.error('Slams loader error:', error)
      throw error
    }
  },
})

function Slams() {
  const { slams: initialSlams } = Route.useLoaderData()
  const { data: slams = initialSlams } = useLiveQuery(query =>
    query.from({ slamItem: slamsCollection }).orderBy(({ slamItem }) => slamItem.slam.createdAt, 'desc'),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Game Slams</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Discover ongoing creative challenges and showcase your game development skills
            </p>
          </div>
          <Button asChild size="lg" className="w-fit">
            <Link to="/slams/create">
              <Plus className="mr-2 h-4 w-4" />
              Create your own Slam
            </Link>
          </Button>
        </div>

        {/* Slams Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {slams.map((slamData: any) => (
            <Card
              key={slamData.slam.id}
              className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col"
            >
              <Link to="/slams/show/$id" params={{ id: slamData.slam.id }} search={{}} className="h-full flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {slamData.slam.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                    {slamData.slam.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 flex-grow">
                  {/* Featured Artist */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Gamepad2 className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      <span className="font-medium">Featured Artist:</span> {slamData.artist?.name || 'TBA'}
                    </span>
                  </div>

                  {/* Organizer */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      <span className="font-medium">Organized by:</span> {slamData.creator?.name || 'Unknown Organizer'}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Trophy className="mr-1 h-3 w-3" />
                      {slamData.entryCount} {slamData.entryCount === 1 ? 'submission' : 'submissions'}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Join Slam
                  </Button>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {slams.length === 0 && (
          <div className="text-center py-12">
            <Gamepad2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No game slams yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to create a game slam and challenge the community with your creative theme.
            </p>
            <Button asChild>
              <Link to="/slams/create">
                <Plus className="mr-2 h-4 w-4" />
                Create your first Slam
              </Link>
            </Button>
          </div>
        )}

        {/* Load More Section - Commented out as requested */}
        {/* TODO: Add load more functionality */}
        {/*
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More Slams
          </Button>
        </div>
        */}
      </main>
    </div>
  )
}
