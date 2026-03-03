import { useLoaderData } from '@tanstack/react-router'
import { Star, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const LatestEntriesSection = () => {
  const { featuredContent } = useLoaderData({ from: '/' })

  return (
    <section className="bg-muted/30 py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">Latest Entries</h2>
          <p className="text-lg text-muted-foreground">Fresh submissions from our creative community</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredContent.entries.map((entry) => (
            <Card key={entry.id} className="group h-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{entry.name}</h3>
                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                  {entry.description ?? 'No description provided'}
                </p>
                <p className="mb-4 text-xs text-muted-foreground">By {entry.userName}</p>
                <Button asChild size="sm" variant="outline" className="w-full">
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
  )
}
