import { useLoaderData, Link } from '@tanstack/react-router'
import { User, Folder } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const TopArtistsSection = () => {
  const { featuredContent } = useLoaderData({ from: '/' })

  return (
    <section className="bg-muted/30 py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">Top Artists</h2>
          <p className="text-lg text-muted-foreground">Discover talented creators in our community</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredContent.artists.map((artist) => (
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
                <Button asChild size="sm" variant="outline">
                  <Link to="/artists/$artistName" params={{ artistName: artist.name }}>View Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
