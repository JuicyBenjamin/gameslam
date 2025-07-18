import { component$ } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";

export default component$(() => {
  return (
    <div class="container mx-auto px-4 py-8">
      <h1 class="mb-8 text-4xl font-bold">What is a Game Slam?</h1>

      <div class="prose prose-lg max-w-none">
        <p class="mb-6">
          A Game Slam is a fun way to practice game development, inspired by
          game jams but with a more relaxed approach. Instead of rushing to
          create a complete game, you'll focus on building specific game
          mechanics and learning as you go.
        </p>

        <h2 class="mb-4 mt-8 text-2xl font-semibold">
          What Makes Game Slams Different?
        </h2>
        <ul class="mb-6 list-disc pl-6">
          <li class="mb-2">
            <strong>Learn at Your Own Pace:</strong> Take time to understand and
            implement game mechanics without the pressure of a strict deadline.
          </li>
          <li class="mb-2">
            <strong>Focus on What Matters:</strong> Concentrate on making your
            game mechanics feel good, rather than trying to build everything at
            once.
          </li>
          <li class="mb-2">
            <strong>Clear Goals:</strong> Each slam comes with a simple
            checklist of what you need to do to complete it.
          </li>
        </ul>

        <h2 class="mb-4 mt-8 text-2xl font-semibold">How It Works</h2>
        <p class="mb-6">
          When you join a Game Slam, you'll get a challenge and a set of game
          assets to work with. Here's why this approach is helpful:
        </p>
        <ul class="mb-6 list-disc pl-6">
          <li class="mb-2">
            <strong>Skip the Art Part:</strong> We point you to the game assets,
            so you can focus on making the game feel fun to play.
          </li>
          <li class="mb-2">
            <strong>Discover New Assets:</strong> Each slam features work from
            game artists, helping you find cool assets for your future projects.
          </li>
          <li class="mb-2">
            <strong>Know When You're Done:</strong> Each challenge has a simple
            list of requirements, so you know exactly what you need to build.
          </li>
        </ul>

        <h2 class="mb-4 mt-8 text-2xl font-semibold">Join the Community</h2>
        <p class="mb-6">Game Slam is a place where you can:</p>
        <ul class="mb-6 list-disc pl-6">
          <li class="mb-2">Try out new game development challenges</li>
          <li class="mb-2">Meet other game developers</li>
          <li class="mb-2">Find game assets for your projects</li>
          <li class="mb-2">Share what you're working on</li>
        </ul>

        <div class="mt-8 text-center">
          <Link href="/slams" class="btn btn-primary btn-lg">
            Check Out Current Slams
          </Link>
        </div>
      </div>
    </div>
  );
});
