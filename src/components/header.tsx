import { Link } from '@tanstack/react-router'

export const Header = () => {
  return (
    <header className="navbar bg-primary sticky top-0 z-50 text-white shadow-md">
      <div className="container mx-auto flex">
        {/* <!-- Left Side: Logo --> */}
        <div className="flex-1">
          <Link className="btn btn-ghost text-xl" to="/">
            Logo
          </Link>
        </div>

        {/* <!-- Right Side: Navigation Links --> */}
        <div className="hidden flex-none items-center space-x-4 md:flex">
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
          {/* TODO: Implement user authentication state */}
          <Link className="btn btn-neutral" to="/login">
            Login
          </Link>
          <Link className="btn btn-neutral" to="/sign-up">
            Sign Up
          </Link>
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
          </ul>
        </div>
      </div>
    </header>
  )
}
