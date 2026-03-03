import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { UserAvatarMenu } from '@/components/UserAvatarMenu'
import { getCurrentUser } from '@/server-functions/auth'
import type { TUser } from '@/db/schema/users'

interface IHeaderProps {
  initialUser: TUser | null
}

export const Header = ({ initialUser }: IHeaderProps) => {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    initialData: initialUser,
  })

  const isLoggedIn = user != null

  return (
    <header className="navbar bg-primary sticky top-0 z-50 text-white shadow-md">
      <div className="container mx-auto flex items-center">
        {/* <!-- Left Side: Logo --> */}
        <div className="flex items-center">
          <Link className="btn btn-ghost text-xl" to="/">
            Logo
          </Link>
        </div>

        {/* <!-- Right Side: Navigation and User Menu --> */}
        <div className="flex-1 flex justify-end">
          <div className="flex items-center space-x-4">
            {/* <!-- Navigation Links --> */}
            <div className="hidden items-center space-x-4 md:flex">
              <Link
                className="btn btn-ghost"
                to="/what-is-a-game-slam"
                activeProps={{
                  className: 'btn btn-ghost underline',
                }}
              >
                What is a Game Slam?
              </Link>
              <Link
                className="btn btn-ghost"
                to="/slams"
                activeProps={{
                  className: 'btn btn-ghost underline',
                }}
              >
                Slams
              </Link>
              <Link
                className="btn btn-ghost"
                to="/artists"
                activeProps={{
                  className: 'btn btn-ghost underline',
                }}
              >
                Artists
              </Link>
            </div>

            {/* <!-- User Menu --> */}
            {isLoggedIn ? (
              <UserAvatarMenu user={user} />
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link className="btn btn-neutral" to="/login">
                  Login
                </Link>
                <Link className="btn btn-neutral" to="/sign-up">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* <!-- Mobile Menu Toggle --> */}
        <div className="dropdown dropdown-end md:hidden">
          <label className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </label>
          <ul className="menu-compact menu dropdown-content rounded-box bg-primary mt-3 w-52 p-2 text-white shadow">
            <li>
              <Link
                to="/what-is-a-game-slam"
                className=""
                activeProps={{
                  className: 'rounded bg-white/20',
                }}
              >
                What is a Game Slam?
              </Link>
            </li>
            <li>
              <Link
                to="/slams"
                className=""
                activeProps={{
                  className: 'rounded bg-white/20',
                }}
              >
                Slams
              </Link>
            </li>
            <li>
              <Link
                to="/artists"
                className=""
                activeProps={{
                  className: 'rounded bg-white/20',
                }}
              >
                Artists
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/$userName" params={{ userName: user.name }}>
                    Profile
                  </Link>
                </li>
                <li>
                  <UserAvatarMenu user={user} />
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className=""
                    activeProps={{
                      className: 'rounded bg-white/20',
                    }}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sign-up"
                    className=""
                    activeProps={{
                      className: 'rounded bg-white/20',
                    }}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  )
}
