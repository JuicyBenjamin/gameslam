// TODO: Migrate from Qwik component$ to React functional component
// TODO: Replace Qwik routeLoader$ with TanStack Router loader
// TODO: Replace Qwik Link with TanStack Router Link

// Original Qwik code (commented out for reference):
// import { component$ } from "@builder.io/qwik";
// import { Link, routeLoader$ } from "@builder.io/qwik-city";
// import { db, logQuery, printQueryStats } from "~/db/logger";
// import { artists } from "~/db/schema/artists";
// import { artistAssets } from "~/db/schema/artistAssets";
// import { slams } from "~/db/schema/slams";
// import { count } from "drizzle-orm";
// import { SolarPallete2Outline, SolarGameboyLinear } from "~/lib/icons";

// export const useArtists = routeLoader$(async (requestEvent) => {
//   // Add caching to prevent duplicate queries
//   requestEvent.cacheControl({
//     // Cache for 2 minutes
//     maxAge: 120,
//     staleWhileRevalidate: 30,
//   });

//   // Get all artists
//   const artistsData = await logQuery("getAllArtists", async () => {
//     return await db.select().from(artists);
//   });

//   // Get asset counts for each artist
//   const assetCounts = await logQuery("getArtistAssetCounts", async () => {
//     return await db
//       .select({
//         artistId: artistAssets.artistId,
//         count: count(artistAssets.assetId),
//       })
//       .from(artistAssets)
//       .groupBy(artistAssets.artistId);
//   });

//   // Get slam counts for each artist
//   const slamCounts = await logQuery("getArtistSlamCounts", async () => {
//     return await db
//       .select({
//         artistId: slams.artistId,
//         count: count(slams.id),
//       })
//       .from(slams)
//       .groupBy(slams.artistId);
//   });

//   // Combine the data
//   const artistsWithCounts = artistsData.map((artist) => {
//     const assetCount =
//       assetCounts.find((ac) => ac.artistId === artist.id)?.count ?? 0;
//     const slamCount =
//       slamCounts.find((sc) => sc.artistId === artist.id)?.count ?? 0;
//     return {
//       ...artist,
//       assetCount,
//       slamCount,
//     };
//   });

//   // Print statistics at the end of this request
//   printQueryStats();

//   return artistsWithCounts;
// });

// export default component$(() => {
//   const artists = useArtists();

//   return (
//     <div class="bg-base-200 min-h-screen">
//       {/* Main Content */}
//       <main class="mx-auto max-w-7xl px-6 py-8">
//         <div class="mb-8 flex items-center justify-between">
//           <h1 class="text-base-content text-4xl font-bold">Artists</h1>
//         </div>

//         {/* Artists Grid */}
//         <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {artists.value.map((artist) => (
//             <Link
//               key={artist.id}
//               href={`/artists/${artist.name}`}
//               class="h-full"
//             >
//               <div class="card bg-base-100 h-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
//                 <div class="card-body">
//                   <h2 class="card-title text-base-content mb-3 text-lg leading-tight">
//                     <SolarPallete2Outline class="mr-2 h-5 w-5" />
//                     {artist.name}
//                   </h2>

//                   <div class="text-base-content/50 mb-4 flex flex-col gap-2 text-xs">
//                     {artist.link && (
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
//                             d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
//                           />
//                         </svg>
//                         <span class="truncate">{artist.link}</span>
//                       </div>
//                     )}
//                   </div>

//                   <div class="flex items-center justify-between">
//                     <div class="flex gap-2">
//                       <div class="badge badge-outline badge-primary text-xs">
//                         <svg
//                           class="mr-1 h-3 w-3"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             stroke-linecap="round"
//                             stroke-linejoin="round"
//                             stroke-width="2"
//                             d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
//                           />
//                         </svg>
//                         {artist.assetCount} assets
//                       </div>
//                       <div class="badge badge-outline badge-secondary text-xs">
//                         <SolarGameboyLinear class="mr-1 h-3 w-3" />
//                         {artist.slamCount} slams
//                       </div>
//                     </div>
//                     <span class="btn btn-primary btn-sm">View Artist</span>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// });

import React from 'react';
import { db, logQuery, printQueryStats } from "~/db/logger";
import { artists } from "~/db/schema/artists";
import { artistAssets } from "~/db/schema/artistAssets";
import { slams } from "~/db/schema/slams";
import { count } from "drizzle-orm";

// TODO: Replace with TanStack Router Link
// import { Link } from '@tanstack/react-router';

// TODO: Replace with TanStack Router loader
// export const useArtists = routeLoader$(async (requestEvent) => {
//   // Add caching to prevent duplicate queries
//   requestEvent.cacheControl({
//     // Cache for 2 minutes
//     maxAge: 120,
//     staleWhileRevalidate: 30,
//   });

//   // Get all artists
//   const artistsData = await logQuery("getAllArtists", async () => {
//     return await db.select().from(artists);
//   });

//   // Get asset counts for each artist
//   const assetCounts = await logQuery("getArtistAssetCounts", async () => {
//     return await db
//       .select({
//         artistId: artistAssets.artistId,
//         count: count(artistAssets.assetId),
//       })
//       .from(artistAssets)
//       .groupBy(artistAssets.artistId);
//   });

//   // Get slam counts for each artist
//   const slamCounts = await logQuery("getArtistSlamCounts", async () => {
//     return await db
//       .select({
//         artistId: slams.artistId,
//         count: count(slams.id),
//       })
//       .from(slams)
//       .groupBy(slams.artistId);
//   });

//   // Combine the data
//   const artistsWithCounts = artistsData.map((artist) => {
//     const assetCount =
//       assetCounts.find((ac) => ac.artistId === artist.id)?.count ?? 0;
//     const slamCount =
//       slamCounts.find((sc) => sc.artistId === artist.id)?.count ?? 0;
//     return {
//       ...artist,
//       assetCount,
//       slamCount,
//     };
//   });

//   // Print statistics at the end of this request
//   printQueryStats();

//   return artistsWithCounts;
// });

export default function Artists() {
  // TODO: Replace with TanStack Router loader
  // const artists = useArtists();
  const artists = { value: [] }; // Mock for now

  return (
    <div className="bg-base-200 min-h-screen">
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-base-content text-4xl font-bold">Artists</h1>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {artists.value.map((artist: any) => (
            <a
              key={artist.id}
              href={`/artists/${artist.name}`}
              className="h-full"
            >
              <div className="card bg-base-100 h-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="card-body">
                  <h2 className="card-title text-base-content mb-3 text-lg leading-tight">
                    {/* TODO: Replace with proper icon component */}
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                    {artist.name}
                  </h2>

                  <div className="text-base-content/50 mb-4 flex flex-col gap-2 text-xs">
                    {artist.link && (
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
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        <span className="truncate">{artist.link}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="badge badge-outline badge-primary text-xs">
                        <svg
                          className="mr-1 h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        {artist.assetCount} assets
                      </div>
                      <div className="badge badge-outline badge-secondary text-xs">
                        {/* TODO: Replace with proper icon component */}
                        <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {artist.slamCount} slams
                      </div>
                    </div>
                    <span className="btn btn-primary btn-sm">View Artist</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}