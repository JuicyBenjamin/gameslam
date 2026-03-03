import { useParams, useLoaderData } from '@tanstack/react-router'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { Trophy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { slamEntriesCollection } from '@/collections'

export const RecentEntries = () => {
  const { id: slamId } = useParams({ from: '/slams/show/$id/' })
  const loaderData = useLoaderData({ from: '/slams/show/$id/' })

  const { data: collectionEntries = [] } = useLiveQuery(query =>
    query
      .from({ entryItem: slamEntriesCollection })
      .where(({ entryItem }) => eq(entryItem.entry.slamId, slamId))
      .orderBy(({ entryItem }) => entryItem.entry.createdAt, 'desc'),
  )

  const entries = collectionEntries.length > 0
    ? collectionEntries.map(entryItem => ({ ...entryItem.entry, user: entryItem.user }))
    : loaderData.slam.entries

  const validEntries = entries.filter((entry: any) => entry !== null)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Recent Entries
          </span>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {validEntries.slice(0, 3).map((entry: any) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted"
            >
              <div>
                <p className="font-medium">{entry.name}</p>
                <p className="text-sm text-muted-foreground">
                  by {entry.user?.name || 'Unknown User'}
                </p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <a href={entry.linkToEntry} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
