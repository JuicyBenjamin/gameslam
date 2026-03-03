import { useParams, useLoaderData } from '@tanstack/react-router'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usersCollection } from '@/collections'

export const UserAvatar = () => {
  const { userName } = useParams({ from: '/_user-profile/$userName/' })
  const loaderData = useLoaderData({ from: '/_user-profile/$userName/' })

  const { data: users = [] } = useLiveQuery(query =>
    query.from({ user: usersCollection }).where(({ user }) => eq(user.name, userName)),
  )
  const user = users[0] || loaderData.user
  if (!user) return null

  const initials = user.name
    .split(' ')
    .map((word: string) => word[0])
    .join('')

  return (
    <div className="relative mb-6 lg:mb-0 lg:mr-8">
      <Avatar className="h-32 w-32 ring-4 ring-card shadow-xl">
        <AvatarImage src={user.avatarLink || '/placeholder.svg'} alt={user.name} />
        <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-accent border-2 border-card flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-card"></div>
      </div>
    </div>
  )
}
