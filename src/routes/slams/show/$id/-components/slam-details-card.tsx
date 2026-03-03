import { useParams, useLoaderData } from '@tanstack/react-router'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { slamsCollection, slamEntriesCollection } from '@/collections'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const SlamDetailsCard = () => {
  const { id: slamId } = useParams({ from: '/slams/show/$id/' })
  const loaderData = useLoaderData({ from: '/slams/show/$id/' })

  const { data: slams = [] } = useLiveQuery(query =>
    query.from({ slamItem: slamsCollection }).where(({ slamItem }) => eq(slamItem.slam.id, slamId)),
  )

  const { data: entries = [] } = useLiveQuery(query =>
    query.from({ entryItem: slamEntriesCollection }).where(({ entryItem }) => eq(entryItem.entry.slamId, slamId)),
  )

  const slam = slams[0]?.slam || loaderData.slam.slam
  const validEntriesCount = entries.length > 0
    ? entries.filter(entryItem => entryItem.entry !== null).length
    : loaderData.slam.entries.filter((entry: any) => entry !== null).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Slam Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Status:</span>
          <Badge variant="default">Active</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Entries:</span>
          <span className="font-medium">{validEntriesCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Created:</span>
          <span className="font-medium">{formatDate(slam.createdAt.toISOString())}</span>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-muted-foreground">Prize:</span>
          <span className="font-medium text-right max-w-[60%]">TBD</span>
        </div>
      </CardContent>
    </Card>
  )
}
