import { Link } from '@tanstack/react-router'
import { Palette, ExternalLink, Package, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface IArtistCardProps {
  artist: {
    id: string
    name: string
    link: string
  }
  assetCount: number
}

export const ArtistCard = ({ artist, assetCount }: IArtistCardProps) => {
  const initials = artist.name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')

  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col">
      <Link to="/artists/$artistName" params={{ artistName: artist.name }} className="h-full flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors flex items-center gap-2">
                <Palette className="h-4 w-4 shrink-0" />
                <span className="truncate">{artist.name}</span>
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 grow">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="truncate font-medium hover:text-primary transition-colors">
              {artist.link.replace('https://', '')}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              <span className="font-medium">{assetCount}</span>
              <span>assets</span>
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
}
