import { useLoaderData } from '@tanstack/react-router'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { Target, CheckCircle, Users } from 'lucide-react'
import { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty'
import { ButtonLink } from '@/components/ui/button-link'
import { Badge } from '@/components/ui/badge'
import { slamEntriesCollection } from '@/collections'
import { EntryCard } from './components/entry-card'

export const SlamEntriesSection = () => {
  const loaderData = useLoaderData({ from: '/_user-profile/$userName/' })
  const userId = loaderData.user?.id

  const { data: userEntries = [] } = useLiveQuery(query =>
    query
      .from({ entryItem: slamEntriesCollection })
      .where(({ entryItem }) => eq(entryItem.entry.userId, userId))
      .orderBy(({ entryItem }) => entryItem.entry.createdAt, 'desc'),
  )

  const entries =
    userEntries.length > 0
      ? userEntries.map(entryItem => ({
          ...entryItem.entry,
          slam: entryItem.slam ? { name: entryItem.slam.name } : null,
        }))
      : loaderData.entries

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Target className="h-6 w-6 text-accent" />
          Slam Entries
        </h2>
        <Badge variant="secondary">{entries.length} entries</Badge>
      </div>

      {entries.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {entries.map((entry: any) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyMedia variant="icon">
            <CheckCircle />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No entries yet</EmptyTitle>
            <EmptyDescription>This user hasn't submitted any slam entries yet.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <ButtonLink to="/slams">
              <Users className="mr-2 h-4 w-4" />
              Explore Slams
            </ButtonLink>
          </EmptyContent>
        </Empty>
      )}
    </section>
  )
}
