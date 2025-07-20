import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { getAllSlams } from "~/db/queries/slams";
import { SolarPallete2Outline } from "~/lib/icons";

export const useSlams = routeLoader$(() => {
  return getAllSlams();
});

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default component$(() => {
  const slams = useSlams();

  return (
    <div class="bg-base-200 min-h-screen">
      {/* Main Content */}
      <main class="mx-auto max-w-7xl px-6 py-8">
        <div class="mb-8 flex items-center justify-between">
          <h1 class="text-base-content text-4xl font-bold">Slams</h1>
          <Link class="btn btn-primary" href="/slams/create">
            <svg
              class="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create your own Slam
          </Link>
        </div>

        {/* Slams Grid */}
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {slams.value.map((slamData) => (
            <Link
              key={slamData.slam.id}
              href={`/slams/show/${slamData.slam.id}`}
              class="h-full"
            >
              <div class="card bg-base-100 h-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div class="card-body">
                  <h2 class="card-title text-base-content mb-3 text-lg leading-tight">
                    {slamData.slam.name}
                  </h2>

                  <p class="text-base-content/70 mb-4 line-clamp-2 text-sm">
                    {slamData.slam.description}
                  </p>

                  <div class="text-base-content/50 mb-4 flex flex-col gap-2 text-xs">
                    <div class="flex items-center space-x-1">
                      <SolarPallete2Outline class="h-3 w-3" key="artist-icon" />
                      <span>
                        Artist: {slamData.artist?.name || "Unknown Artist"}
                      </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-1">
                        <svg
                          class="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>
                          Created by:{" "}
                          {slamData.creator?.name || "Unknown Creator"}
                        </span>
                      </div>
                      <div class="flex items-center space-x-1">
                        <svg
                          class="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{formatDate(slamData.slam.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="badge badge-outline badge-primary text-xs">
                      {slamData.entryCount} entries
                    </div>
                    <span class="btn btn-primary btn-sm">View Slam</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        {/* TODO: Add load more */}
        {/* <div class="mt-12 text-center">
          <button class="btn btn-outline btn-primary">Load More Slams</button>
        </div> */}
      </main>
    </div>
  );
});
