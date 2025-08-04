// TODO: Migrate from Qwik component$ to React functional component
// TODO: Replace Qwik routeLoader$ with TanStack Router loader
// TODO: Replace Qwik Link with TanStack Router Link

// Original Qwik code (commented out for reference):
// import { component$ } from "@builder.io/qwik";
// import { Link, routeLoader$ } from "@builder.io/qwik-city";
// import { getAllSlams } from "~/db/queries/slams";
// import { printQueryStats } from "~/db/logger";
// import { SolarPallete2Outline } from "~/lib/icons";

// export const useSlams = routeLoader$(async (requestEvent) => {
//   // Add caching to prevent duplicate queries
//   requestEvent.cacheControl({
//     // Cache for 2 minutes
//     maxAge: 120,
//     staleWhileRevalidate: 30,
//   });

//   const result = await getAllSlams();

//   // Print statistics at the end of this request
//   printQueryStats();

//   return result;
// });

// // TODO: Move to utils and exchange for temporal solution
// function formatDate(date: Date) {
//   return date.toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// }

// export default component$(() => {
//   const slams = useSlams();

//   return (
//     <div class="bg-base-200 min-h-screen">
//       {/* Main Content */}
//       <main class="mx-auto max-w-7xl px-6 py-8">
//         <div class="mb-8 flex items-center justify-between">
//           <h1 class="text-base-content text-4xl font-bold">Slams</h1>
//           <Link class="btn btn-primary" href="/slams/create">
//             <svg
//               class="mr-2 h-4 w-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//                 stroke-width="2"
//                 d="M12 4v16m8-8H4"
//               />
//             </svg>
//             Create your own Slam
//           </Link>
//         </div>

//         {/* Slams Grid */}
//         <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {slams.value.map((slamData) => (
//             <Link
//               key={slamData.slam.id}
//               href={`/slams/show/${slamData.slam.id}`}
//               class="h-full"
//             >
//               <div class="card bg-base-100 h-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
//                 <div class="card-body">
//                   <h2 class="card-title text-base-content mb-3 text-lg leading-tight">
//                     {slamData.slam.name}
//                   </h2>

//                   <p class="text-base-content/70 mb-4 line-clamp-2 text-sm">
//                     {slamData.slam.description}
//                   </p>

//                   <div class="text-base-content/50 mb-4 flex flex-col gap-2 text-xs">
//                     <div class="flex items-center space-x-1">
//                       <SolarPallete2Outline class="h-3 w-3" key="artist-icon" />
//                       <span>
//                         Artist: {slamData.artist?.name || "Unknown Artist"}
//                       </span>
//                     </div>
//                     <div class="flex items-center justify-between">
//                       <div class="flex items-center space-x-1">
//                         <svg
//                           class="h-3 w-3"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             stroke-linecap="round"
//                             stroke-linejoin="round"
//                             stroke-width="2"
//                             d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                           />
//                         </svg>
//                         <span>
//                           Created by:{" "}
//                           {slamData.creator?.name || "Unknown Creator"}
//                         </span>
//                       </div>
//                       <div class="flex items-center space-x-1">
//                         <svg
//                           class="h-3 w-3"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             stroke-linecap="round"
//                             stroke-linejoin="round"
//                             stroke-width="2"
//                             d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                           />
//                         </svg>
//                         <span>{formatDate(slamData.slam.createdAt)}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div class="flex items-center justify-between">
//                     <div class="badge badge-outline badge-primary text-xs">
//                       {slamData.entryCount} entries
//                     </div>
//                     <span class="btn btn-primary btn-sm">View Slam</span>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         {/* Load More */}
//         {/* TODO: Add load more */}
//         {/* <div class="mt-12 text-center">
//           <button class="btn btn-outline btn-primary">Load More Slams</button>
//         </div> */}
//       </main>
//     </div>
//   );
// });

import React from 'react';
import { getAllSlams } from "~/db/queries/slams";
import { printQueryStats } from "~/db/logger";

// TODO: Replace with TanStack Router Link
// import { Link } from '@tanstack/react-router';

// TODO: Move to utils and exchange for temporal solution
function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// TODO: Replace with TanStack Router loader
// export const useSlams = routeLoader$(async (requestEvent) => {
//   // Add caching to prevent duplicate queries
//   requestEvent.cacheControl({
//     // Cache for 2 minutes
//     maxAge: 120,
//     staleWhileRevalidate: 30,
//   });

//   const result = await getAllSlams();

//   // Print statistics at the end of this request
//   printQueryStats();

//   return result;
// });

export default function Slams() {
  // TODO: Replace with TanStack Router loader
  // const slams = useSlams();
  const slams = { value: [] }; // Mock for now

  return (
    <div className="bg-base-200 min-h-screen">
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-base-content text-4xl font-bold">Slams</h1>
          <a className="btn btn-primary" href="/slams/create">
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create your own Slam
          </a>
        </div>

        {/* Slams Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {slams.value.map((slamData: any) => (
            <a
              key={slamData.slam.id}
              href={`/slams/show/${slamData.slam.id}`}
              className="h-full"
            >
              <div className="card bg-base-100 h-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="card-body">
                  <h2 className="card-title text-base-content mb-3 text-lg leading-tight">
                    {slamData.slam.name}
                  </h2>

                  <p className="text-base-content/70 mb-4 line-clamp-2 text-sm">
                    {slamData.slam.description}
                  </p>

                  <div className="text-base-content/50 mb-4 flex flex-col gap-2 text-xs">
                    <div className="flex items-center space-x-1">
                      {/* TODO: Replace with proper icon component */}
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                      <span>
                        Artist: {slamData.artist?.name || "Unknown Artist"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>
                          Created by:{" "}
                          {slamData.creator?.name || "Unknown Creator"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{formatDate(slamData.slam.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="badge badge-outline badge-primary text-xs">
                      {slamData.entryCount} entries
                    </div>
                    <span className="btn btn-primary btn-sm">View Slam</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Load More */}
        {/* TODO: Add load more */}
        {/* <div className="mt-12 text-center">
          <button className="btn btn-outline btn-primary">Load More Slams</button>
        </div> */}
      </main>
    </div>
  );
}