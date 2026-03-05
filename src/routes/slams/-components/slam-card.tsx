import { Link } from '@tanstack/react-router'
import { Gamepad2, User, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ISlamCardProps {
  slam: {
    id: string
    name: string
    description: string
  }
  artist: { name: string } | null
  createdBy: { name: string } | null
  entryCount: number
}

export const SlamCard = ({ slam, artist, createdBy, entryCount }: ISlamCardProps) => {
  const submissionLabel = entryCount === 1 ? 'submission' : 'submissions'

  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col">
      <Link to="/slams/show/$id" params={{ id: slam.id }} className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {slam.name}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-sm leading-relaxed">
            {slam.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 grow">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Gamepad2 className="h-4 w-4 shrink-0" />
            <span className="truncate">
              <span className="font-medium">Featured Artist:</span> {artist?.name ?? 'TBA'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4 shrink-0" />
            <span className="truncate">
              <span className="font-medium">Organized by:</span> {createdBy?.name ?? 'Unknown Organizer'}
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Trophy className="mr-1 h-3 w-3" />
              {entryCount} {submissionLabel}
            </Badge>
          </div>
          <Button variant="outline" size="sm">
            Join Slam
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}
