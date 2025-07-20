import { component$ } from "@builder.io/qwik";
import { Form, Link, useLocation } from "@builder.io/qwik-city";
import { useLogout } from "./actions/logout";
import { useCurrentUser } from "~/loaders/auth";

export const Header = component$(() => {
  const logout = useLogout();
  const user = useCurrentUser();
  const location = useLocation();
  const isLoggedIn = user.value != null;

  // Helper function to determine if a route is active
  const isActiveRoute = (href: string) => {
    // Handle exact match for home page
    if (href === "/" && location.url.pathname === "/") {
      return true;
    }
    // Handle other routes (but not home page)
    return href !== "/" && location.url.pathname.startsWith(href);
  };

  return (
    <header class="navbar bg-primary sticky top-0 z-50 text-white shadow-md">
      <div class="container mx-auto flex">
        {/* <!-- Left Side: Logo --> */}
        <div class="flex-1">
          <Link class={`btn btn-ghost text-xl `} href="/">
            Logo
          </Link>
        </div>

        {/* <!-- Right Side: Navigation Links --> */}
        <div class="hidden flex-none items-center space-x-4 md:flex">
          <Link
            class={`btn btn-ghost ${isActiveRoute("/what-is-a-game-slam") ? "underline" : ""}`}
            href="/what-is-a-game-slam"
          >
            What is a Game Slam?
          </Link>
          <Link
            class={`btn btn-ghost ${isActiveRoute("/slams") ? "underline" : ""}`}
            href="/slams"
          >
            Slams
          </Link>
          <Link
            class={`btn btn-ghost ${isActiveRoute("/artists") ? "underline" : ""}`}
            href="/artists"
          >
            Artists
          </Link>
          {isLoggedIn ? (
            <>
              <Form action={logout}>
                <button class="btn btn-neutral" type="submit">
                  Logout
                </button>
              </Form>
              <Link href={`/${user.value.name}`} class="avatar">
                <div class="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2">
                  <img
                    src={user.value.avatarLink}
                    alt={`${user.value.name}'s avatar`}
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
          <ul class="menu-compact menu dropdown-content rounded-box bg-primary mt-3 w-52 p-2 text-white shadow">
            <li>
              <Link
                href="/what-is-a-game-slam"
                class={
                  isActiveRoute("/what-is-a-game-slam")
                    ? "rounded bg-white/20"
                    : ""
                }
              >
                What is a Game Slam?
              </Link>
            </li>
            <li>
              <Link
                href="/slams"
                class={isActiveRoute("/slams") ? "rounded bg-white/20" : ""}
              >
                Slams
              </Link>
            </li>
            <li>
              <Link
                href="/artists"
                class={isActiveRoute("/artists") ? "rounded bg-white/20" : ""}
              >
                Artists
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Form action={logout}>
                    <button class="btn btn-neutral" type="submit">
                      Logout
                    </button>
                  </Form>
                </li>
                <li>
                  <Link
                    href={`/${user.value.name}`}
                    class={
                      isActiveRoute(`/${user.value.name}`)
                        ? "rounded bg-white/20"
                        : ""
                    }
                  >
                    Profile
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    class={isActiveRoute("/login") ? "rounded bg-white/20" : ""}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-up"
                    class={
                      isActiveRoute("/sign-up") ? "rounded bg-white/20" : ""
                    }
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
  );
});
