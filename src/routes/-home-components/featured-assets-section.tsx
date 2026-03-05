import { useLoaderData } from '@tanstack/react-router'
import { Palette, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button-link'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const FeaturedAssetsSection = () => {
  const { featuredContent } = useLoaderData({ from: '/' })

  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">Featured Assets</h2>
          <p className="text-lg text-muted-foreground">High-quality resources for your game projects</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredContent.assets.map((asset) => (
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
                <ButtonLink href={asset.link} target="_blank" rel="noopener noreferrer" size="sm" variant="outline">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  View Asset
                </ButtonLink>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
