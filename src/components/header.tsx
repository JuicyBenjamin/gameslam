import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { useIsUserLoggedIn } from "~/loaders/auth";

export const Header = component$(() => {
  const isUserLoggedIn = useIsUserLoggedIn();

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
        <div class="hidden flex-none space-x-4 md:flex">
          <Link class="btn btn-ghost" href="/slams">
            Slams
          </Link>
          {isUserLoggedIn.value ? (
            <Link class="btn btn-neutral" href="/logout">
              Logout
            </Link>
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
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
});
