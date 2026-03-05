import { ExternalLink } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/format-date'

interface IEntryCardProps {
  entry: any
}

export const EntryCard = ({ entry }: IEntryCardProps) => {
  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="line-clamp-2">{entry.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {entry.description || 'No description provided'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Submitted</span>
            <span className="font-medium">{formatDate(entry.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Slam</span>
            <span className="font-medium">{entry.slam?.name || 'Unknown Slam'}</span>
          </div>
        </div>
      </CardContent>
      <CardContent className="pt-0">
        <ButtonLink href={entry.linkToEntry} target="_blank" rel="noopener noreferrer" size="sm" variant="outline" className="w-full">
          <ExternalLink className="mr-2 h-4 w-4" />
          View Entry
        </ButtonLink>
      </CardContent>
    </Card>
  )
}
