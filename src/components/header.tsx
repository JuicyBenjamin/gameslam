import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { useCurrentUser } from "~/loaders/auth";

export const Header = component$(() => {
  const currentUser = useCurrentUser();
  const isLoggedIn = currentUser.value !== null;

  return (
    <header class="navbar sticky top-0 z-50 bg-primary text-white shadow-md">
      <div class="container mx-auto">
        {/* <!-- Left Side: Logo --> */}
        <div class="flex-1">
          <Link class="btn btn-ghost text-xl normal-case" href="/">
            Logo
          </Link>
        </div>

        {/* <!-- Right Side: Navigation Links --> */}
        <div class="hidden flex-none items-center space-x-4 md:flex">
          <Link class="btn btn-ghost" href="/slams">
            Slams
          </Link>
          <Link class="btn btn-ghost" href="/artists">
            Artists
          </Link>
          {isLoggedIn ? (
            <>
              <Link class="btn btn-neutral" href="/logout" prefetch={false}>
                Logout
              </Link>
              <Link href={`/${currentUser.value.name}`} class="avatar">
                <div class="w-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  <img
                    src={currentUser.value.avatarLink}
                    alt={`${currentUser.value.name}'s avatar`}
                    width="40"
                    height="40"
                  />
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link class="btn btn-neutral" href="/login">
                Login
              </Link>
              <Link class="btn btn-neutral" href="/sign-up">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* <!-- Mobile Menu Toggle --> */}
        <div class="dropdown dropdown-end md:hidden">
          <label class="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </label>
          <ul class="menu-compact menu dropdown-content mt-3 w-52 rounded-box bg-primary p-2 text-white shadow">
            <li>
              <Link href="/slams">Slams</Link>
            </li>
            <li>
              <Link href="/artists">Artists</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link href="/logout">Logout</Link>
                </li>
                <li>
                  <Link href={`/${currentUser.value.name}`}>Profile</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login">Login</Link>
                </li>
                <li>
                  <Link href="/sign-up">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
});
