import { Link, useRouter } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { TUser } from '@/db/schema/users'
import { supabaseBrowser as supabase } from '@/lib/supabase.client'

interface UserAvatarMenuProps {
  user: TUser
}

export const UserAvatarMenu = ({ user }: UserAvatarMenuProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      await router.invalidate()
      router.navigate({ to: '/' })
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full p-1 hover:bg-white/10 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarLink || undefined} />
            <AvatarFallback className="bg-white/20 text-white text-sm">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link to="/$userName" params={{ userName: user.name }}>
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button onClick={() => mutate()} disabled={isPending} className="w-full text-left">
            {isPending ? 'Logging out...' : 'Logout'}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
