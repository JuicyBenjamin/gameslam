import { useLoaderData, Link } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const FeaturedSlamsSection = () => {
  const { featuredContent } = useLoaderData({ from: '/' })

  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">Featured Slams</h2>
          <p className="text-lg text-muted-foreground">Join exciting competitions and showcase your skills</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredContent.slams.map((slamData) => (
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
                <Button asChild size="sm" variant="outline">
                  <Link to="/slams/show/$id" params={{ id: slamData.slam.id }}>View Slam</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
