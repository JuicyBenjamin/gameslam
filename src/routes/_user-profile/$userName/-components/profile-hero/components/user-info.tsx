import { useParams, useLoaderData } from '@tanstack/react-router'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { Shield, Trophy, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { usersCollection, slamsCollection, slamEntriesCollection } from '@/collections'
import { EditProfileDialog } from './edit-profile-dialog'

const TOTAL_ACHIEVEMENTS = 6

export const UserInfo = () => {
  const { userName } = useParams({ from: '/_user-profile/$userName/' })
  const loaderData = useLoaderData({ from: '/_user-profile/$userName/' })

  const { data: users = [] } = useLiveQuery(query =>
    query.from({ user: usersCollection }).where(({ user }) => eq(user.name, userName)),
  )
  const user = users[0] || loaderData.user
  if (!user) return null

  const userId = loaderData.user?.id || user?.id

  const { data: userSlams = [] } = useLiveQuery(query =>
    query.from({ slamItem: slamsCollection }).where(({ slamItem }) => eq(slamItem.slam.creatorId, userId)),
  )

  const { data: userEntries = [] } = useLiveQuery(query =>
    query.from({ entryItem: slamEntriesCollection }).where(({ entryItem }) => eq(entryItem.entry.userId, userId)),
  )

  const slamsCount = userSlams.length || loaderData.slams.length
  const entriesCount = userEntries.length || loaderData.entries.length

  const earnedCount = [
    slamsCount > 0,
    slamsCount >= 5,
    slamsCount >= 10,
    entriesCount > 0,
    entriesCount >= 10,
    entriesCount >= 25,
  ].filter(Boolean).length

  return (
    <div className="flex-1">
      <div className="flex flex-col items-center lg:items-start">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {user.name}
          </h1>
          {user.isVerified && (
            <Badge variant="default">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        <p className="text-xl text-muted-foreground mb-4">@{user.name}</p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {earnedCount}/{TOTAL_ACHIEVEMENTS} Achievements
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Member since {new Date().getFullYear()}</span>
          </div>
        </div>

        <EditProfileDialog />
      </div>
    </div>
  )
}
