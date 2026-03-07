import { Link, useRouter } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import type { TUser } from '@/lib/auth'

interface IUserAvatarMenuProps {
  user: TUser
}

export const UserAvatarMenu = ({ user }: IUserAvatarMenuProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await authClient.signOut()
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      router.invalidate()
      await router.navigate({ to: '/' })
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<button className="rounded-full p-1 hover:bg-white/10 transition-colors" />}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback className="bg-white/20 text-white text-sm">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem render={<Link to="/$userName" params={{ userName: user.name }} />}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem render={<button onClick={() => mutate()} disabled={isPending} className="w-full text-left" />}>
          {isPending ? 'Logging out...' : 'Logout'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
