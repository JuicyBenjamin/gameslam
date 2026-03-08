import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonLink } from '@/components/ui/button-link'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { buttonVariants } from '@/components/ui/button'
import { UserAvatarMenu } from '@/components/UserAvatarMenu'
import { getCurrentUser } from '@/server-functions/auth'
import type { TUser } from '@/lib/auth'

interface IHeaderProps {
  initialUser: TUser | null
}

const navLinks = [
  { to: '/what-is-a-game-slam', label: 'What is a Game Slam?' },
  { to: '/slams', label: 'Slams' },
  { to: '/artists', label: 'Artists' },
] as const

export const Header = ({ initialUser }: IHeaderProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    initialData: initialUser,
  })

  const isLoggedIn = user != null

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold transition-opacity hover:opacity-80">
          Logo
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-white/10 hover:text-primary-foreground"
              activeProps={{ className: 'rounded-lg px-3 py-2 text-sm font-medium text-primary-foreground bg-white/10' }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <UserAvatarMenu user={user} />
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <ButtonLink to="/login" size="sm" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Sign in
              </ButtonLink>
            </div>
          )}

          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-white/10 md:hidden"
                />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={buttonVariants({ variant: 'ghost', className: 'justify-start' })}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
                <Separator className="my-2" />
                {isLoggedIn ? (
                  <Link
                    to="/$userName"
                    params={{ userName: user.name }}
                    className={buttonVariants({ variant: 'ghost', className: 'justify-start' })}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Profile
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className={buttonVariants({ variant: 'ghost', className: 'justify-start' })}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Sign in
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
