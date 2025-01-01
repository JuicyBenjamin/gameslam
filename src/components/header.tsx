import { component$ } from "@builder.io/qwik";

export const Header = component$(() => {
  return (
    <header class="navbar bg-primary sticky top-0 z-50 text-white shadow-md">
      <div class="container mx-auto">
        {/* <!-- Left Side: Logo --> */}
        <div class="flex-1">
          <a class="btn btn-ghost text-xl normal-case" href="/">
            Logo
          </a>
        </div>

        {/* <!-- Right Side: Navigation Links --> */}
        <div class="hidden flex-none space-x-4 md:flex">
          <a class="btn btn-ghost" href="#home">
            Home
          </a>
          <a class="btn btn-ghost" href="#about">
            About
          </a>
          <a class="btn btn-ghost" href="#services">
            Services
          </a>
          <a class="btn btn-ghost" href="#contact">
            Contact
          </a>
        </div>

        {/* <!-- Mobile Menu Toggle --> */}
        <div class="dropdown dropdown-end md:hidden">
          <label tabindex="0" class="btn btn-ghost">
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
          <ul
            tabindex="0"
            class="menu menu-compact dropdown-content bg-primary rounded-box mt-3 w-52 p-2 text-white shadow"
          >
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
