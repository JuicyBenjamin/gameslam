import { useLoaderData, Link } from '@tanstack/react-router'
import { Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const FeaturedAsset = () => {
  const loaderData = useLoaderData({ from: '/slams/show/$id/' })
  const { artist, asset } = loaderData.slam

  if (!artist || !asset) return null

  const initials = artist.name
    .split(' ')
    .map((word: string) => word.charAt(0))
    .join('')
    .toUpperCase()

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Featured Asset
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg" alt={artist.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Button variant="link" asChild className="p-0 h-auto text-lg font-semibold">
                <Link to="/artists/$artistName" params={{ artistName: artist.name }}>{asset.name}</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-2">by {artist.name}</p>
            <p className="text-sm text-muted-foreground">Featured asset for this slam</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
