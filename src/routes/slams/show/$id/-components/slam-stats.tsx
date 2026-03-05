import { useParams, useLoaderData } from '@tanstack/react-router'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { Trophy, User } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'
import { Card, CardContent } from '@/components/ui/card'
import { slamEntriesCollection } from '@/collections'

export const SlamStats = () => {
  const { id: slamId } = useParams({ from: '/slams/show/$id/' })
  const loaderData = useLoaderData({ from: '/slams/show/$id/' })

  const { data: entries = [] } = useLiveQuery(query =>
    query.from({ entryItem: slamEntriesCollection }).where(({ entryItem }) => eq(entryItem.entry.slamId, slamId)),
  )

  const validEntries = entries.length > 0
    ? entries.filter(entryItem => entryItem.entry !== null)
    : loaderData.slam.entries.filter((entry: any) => entry !== null)

  const createdBy = loaderData.slam.createdBy

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Entries</p>
              <p className="text-lg font-semibold">{validEntries.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created by</p>
              {createdBy?.name && (
                <ButtonLink to="/$userName" params={{ userName: createdBy.name }} variant="link" className="p-0 h-auto text-lg font-semibold">
                  {createdBy.name}
                </ButtonLink>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
