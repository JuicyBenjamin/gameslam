// TODO: Migrate from Qwik component$ to React functional component
// TODO: Replace Qwik routeLoader$ with TanStack Router loader
// TODO: Replace Qwik Link with TanStack Router Link
// TODO: Replace Qwik route parameters with TanStack Router params

// Original Qwik code (commented out for reference):
// import { component$ } from "@builder.io/qwik";
// import { Link, routeLoader$ } from "@builder.io/qwik-city";
// import { db, logQuery, printQueryStats } from "~/db/logger";
// import { artists } from "~/db/schema/artists";
// import { assets } from "~/db/schema/assets";
// import { artistAssets } from "~/db/schema/artistAssets";
// import { slams } from "~/db/schema/slams";
// import { eq } from "drizzle-orm";
// import {
//   SolarPallete2Outline,
//   SolarGamepadMinimalisticLinear,
// } from "~/lib/icons";
// import { parse } from "node-html-parser";

// export const useArtistProfile = routeLoader$(async (requestEvent) => {
//   const artistName = requestEvent.params.artistName;

//   // Add caching to prevent duplicate queries
//   requestEvent.cacheControl({
//     // Cache for 2 minutes
//     maxAge: 120,
//     staleWhileRevalidate: 30,
//   });

//   // Get artist by name
//   const artistData = await logQuery("getArtistByName", async () => {
//     return await db
//       .select()
//       .from(artists)
//       .where(eq(artists.name, artistName))
//       .limit(1);
//   });

//   if (artistData.length === 0) {
//     throw requestEvent.error(404, "Artist not found");
//   }

//   const artist = artistData[0];

//   // Get assets created by the artist through the join table
//   const artistAssetsData = await logQuery("getArtistAssets", async () => {
//     return await db
//       .select({
//         asset: assets,
//       })
//       .from(artistAssets)
//       .innerJoin(assets, eq(artistAssets.assetId, assets.id))
//       .where(eq(artistAssets.artistId, artist.id));
//   });

//   // Get slams that use the artist's assets with counts
//   const slamsData = await logQuery("getArtistSlams", async () => {
//     return await db
//       .select({
//         slam: slams,
//         asset: assets,
//       })
//       .from(slams)
//       .innerJoin(assets, eq(slams.assetId, assets.id))
//       .where(eq(slams.artistId, artist.id));
//   });

//   // Fetch itch.io profile data
//   const itchData = {
//     avatarUrl: null as string | null,
//     followerCount: null as string | null,
//   };

//   try {
//     const itchUrl = `https://itch.io/profile/${artistName.replace(/\s+/g, "").toLowerCase()}`;
//     const response = await fetch(itchUrl);

//     if (response.ok) {
//       const html = await response.text();
//       const root = parse(html);

//       // Find the stat_header_widget div
//       const statHeaderWidget = root.querySelector(".stat_header_widget");

//       if (statHeaderWidget) {
//         // Extract avatar URL from style attribute of .avatar element
//         const avatarElement = statHeaderWidget.querySelector(".avatar");

//         if (avatarElement) {
//           const style = avatarElement.getAttribute("style");

//           if (style) {
//             const urlMatch = style.match(/url\(['"]?(.*?)['"]?\)/);

//             if (urlMatch && urlMatch[1]) {
//               let avatarUrl = urlMatch[1];
//               // Handle relative URLs (default itch.io avatars)
//               if (!/^https?:\/\//.test(avatarUrl)) {
//                 avatarUrl = `https://itch.io${avatarUrl}`;
//               }
//               itchData.avatarUrl = avatarUrl;
//             }
//           }
//         }

//         // Extract follower count from .stat_box divs
//         const statBoxes = statHeaderWidget.querySelectorAll(".stat_box");

//         if (statBoxes.length >= 3) {
//           const followersContainer = statBoxes[2]; // Third child (0-indexed)
//           const firstChild = followersContainer.querySelector("*");

//           if (firstChild) {
//             const followerText = firstChild.text.trim();
//             const followerMatch = followerText.match(/(\d+(?:\.\d+)?[kmb]?)/i);

//             if (followerMatch) {
//               itchData.followerCount = followerMatch[1];
//             }
//           }
//         }
//       }
//     }
//   } catch (error) {
//     // Continue without itch data if fetch fails
//   }

//   const result = {
//     artist,
//     assets: artistAssetsData.map((a) => a.asset),
//     slams: slamsData.map((s) => ({
//       ...s.slam,
//       asset: s.asset,
//     })),
//     itchData,
//   };

//   // Print statistics at the end of this request
//   printQueryStats();

//   return result;
// });

// export default component$(() => {
//   const artistProfile = useArtistProfile();

//   return (
//     <div class="bg-base-200 min-h-screen">
//       {/* Hero Section */}
//       <div class="from-primary to-secondary bg-gradient-to-br">
//         <div class="container mx-auto px-4 py-12">
//           <div class="flex flex-col items-center gap-8 md:flex-row">
//             <div class="avatar">
//               <div class="ring-base-100 ring-offset-base-100 h-32 w-32 rounded-full ring ring-offset-4">
//                 {artistProfile.value.itchData.avatarUrl ? (
//                   <img
//                     src={artistProfile.value.itchData.avatarUrl}
//                     alt={`${artistProfile.value.artist.name}'s avatar`}
//                     width={128}
//                     height={128}
//                     class="rounded-full"
//                   />
//                 ) : (
//                   <div class="bg-base-100/20 flex h-full w-full items-center justify-center rounded-full">
//                     <SolarPallete2Outline
//                       class="text-base-100 h-12 w-12"
//                       key="artist-avatar-icon"
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div class="text-center md:text-left">
//               <h1 class="text-base-100 mb-4 text-4xl font-bold md:text-5xl">
//                 {artistProfile.value.artist.name}
//               </h1>
//               <div class="stats stats-horizontal bg-base-100/10 backdrop-blur-sm">
//                 <div class="stat text-center">
//                   <div class="stat-title text-base-100/80 mb-2">
//                     Listed Assets
//                   </div>
//                   <div class="flex items-center justify-center gap-3">
//                     <SolarPallete2Outline
//                       class="text-base-100 h-8 w-8"
//                       key="palette-stat-icon"
//                     />
//                     <div class="stat-value text-base-100">
//                       {artistProfile.value.assets.length}
//                     </div>
//                   </div>
//                 </div>
//                 <div class="stat text-center">
//                   <div class="stat-title text-base-100/80 mb-2">
//                     Featured In Slams
//                   </div>
//                   <div class="flex items-center justify-center gap-3">
//                     <SolarGamepadMinimalisticLinear
//                       class="text-base-100 h-8 w-8"
//                       key="gamepad-stat-icon"
//                     />
//                     <div class="stat-value text-base-100">
//                       {artistProfile.value.slams.length}
//                     </div>
//                   </div>
//                 </div>
//                 {artistProfile.value.itchData.followerCount !== null && (
//                   <div class="stat text-center">
//                     <div class="stat-title text-base-100/80 mb-2">
//                       Itch Followers
//                     </div>
//                     <div class="flex items-center justify-center gap-3">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="32"
//                         height="32"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         stroke-width="1.5"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                         class="text-base-100 h-8 w-8"
//                         key="followers-stat-icon"
//                       >
//                         <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//                         <circle cx="9" cy="7" r="4" />
//                         <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
//                         <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//                       </svg>
//                       <div class="stat-value text-base-100">
//                         {artistProfile.value.itchData.followerCount}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <div class="mt-4">
//                 <a
//                   href={artistProfile.value.artist.link}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   class="btn btn-outline btn-primary"
//                 >
//                   Visit itch.io page
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Content Section */}
//       <div class="container mx-auto px-4 py-12">
//         <div class="grid gap-8 lg:grid-cols-2">
//           {/* Assets */}
//           <div class="space-y-6">
//             <div class="mb-6 flex items-center gap-3">
//               <SolarPallete2Outline
//                 class="text-primary h-6 w-6"
//                 key="palette-icon"
//               />
//               <h2 class="text-2xl font-bold">Assets</h2>
//             </div>
//             {artistProfile.value.assets.length === 0 ? (
//               <div class="card bg-base-100 shadow-lg">
//                 <div class="card-body text-center">
//                   <p class="text-base-content/70">No assets found</p>
//                 </div>
//               </div>
//             ) : (
//               <div class="space-y-4">
//                 {artistProfile.value.assets.map((asset) => (
//                   <a
//                     key={asset.id}
//                     href={asset.link}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     class="block"
//                   >
//                     <div class="card bg-base-100 shadow-lg transition-shadow duration-300 hover:shadow-xl">
//                       <div class="card-body">
//                         <h3 class="card-title text-lg">{asset.name}</h3>
//                         <div class="flex items-center justify-between">
//                           <div class="text-base-content/60 flex items-center gap-4 text-sm">
//                             <div class="flex items-center gap-1">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="16"
//                                 height="16"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 stroke-width="2"
//                                 stroke-linecap="round"
//                                 stroke-linejoin="round"
//                               >
//                                 <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
//                                 <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
//                               </svg>
//                               <span>View on itch.io</span>
//                             </div>
//                           </div>
//                           <div class="badge badge-primary badge-outline">
//                             Asset
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </a>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Slams Using Assets */}
//           <div class="space-y-6">
//             <div class="mb-6 flex items-center gap-3">
//               <SolarGamepadMinimalisticLinear
//                 class="text-secondary h-6 w-6"
//                 key="gamepad-header-icon"
//               />
//               <h2 class="text-2xl font-bold">Slams Featuring Assets</h2>
//             </div>
//             {artistProfile.value.slams.length === 0 ? (
//               <div class="card bg-base-100 shadow-lg">
//                 <div class="card-body text-center">
//                   <p class="text-base-content/70">
//                     No slams found using these assets
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <div class="space-y-4">
//                 {artistProfile.value.slams.map((slam) => (
//                   <Link
//                     key={slam.id}
//                     href={`/slams/show/${slam.id}`}
//                     class="block"
//                   >
//                     <div class="card bg-base-100 shadow-lg transition-shadow duration-300 hover:shadow-xl">
//                       <div class="card-body">
//                         <h3 class="card-title text-lg">{slam.name}</h3>
//                         <p class="text-base-content/70 mb-4">
//                           {slam.description}
//                         </p>
//                         <div class="flex items-center justify-between">
//                           <div class="text-base-content/60 flex items-center gap-4 text-sm">
//                             <div class="flex items-center gap-1">
//                               <SolarPallete2Outline class="h-4 w-4" />
//                               <span>Using: {slam.asset.name}</span>
//                             </div>
//                             {slam.createdAt && (
//                               <div class="flex items-center gap-1">
//                                 <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   width="16"
//                                   height="16"
//                                   viewBox="0 0 24 24"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   stroke-width="2"
//                                   stroke-linecap="round"
//                                   stroke-linejoin="round"
//                                 >
//                                   <path d="M8 2v4" />
//                                   <path d="M16 2v4" />
//                                   <rect
//                                     width="18"
//                                     height="18"
//                                     x="3"
//                                     y="4"
//                                     rx="2"
//                                   />
//                                   <path d="M3 10h18" />
//                                 </svg>
//                                 <span>
//                                   {new Date(
//                                     slam.createdAt,
//                                   ).toLocaleDateString()}
//                                 </span>
//                               </div>
//                             )}
//                           </div>
//                           <div class="badge badge-secondary badge-outline">
//                             Featured
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

import React from 'react';
import { db, logQuery, printQueryStats } from "~/db/logger";
import { artists } from "~/db/schema/artists";
import { assets } from "~/db/schema/assets";
import { artistAssets } from "~/db/schema/artistAssets";
import { slams } from "~/db/schema/slams";
import { eq } from "drizzle-orm";
import { parse } from "node-html-parser";

// TODO: Replace with TanStack Router Link
// import { Link } from '@tanstack/react-router';

// TODO: Replace with TanStack Router loader
// export const useArtistProfile = routeLoader$(async (requestEvent) => {
//   const artistName = requestEvent.params.artistName;
//   // ... rest of the loader logic
// });

export default function ArtistProfile() {
  // TODO: Replace with TanStack Router loader and params
  // const artistProfile = useArtistProfile();
  const artistProfile = {
    value: {
      artist: { name: "Mock Artist", link: "#" },
      assets: [],
      slams: [],
      itchData: { avatarUrl: null, followerCount: null }
    }
  };

  return (
    <div className="bg-base-200 min-h-screen">
      {/* Hero Section */}
      <div className="from-primary to-secondary bg-gradient-to-br">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="avatar">
              <div className="ring-base-100 ring-offset-base-100 h-32 w-32 rounded-full ring ring-offset-4">
                {artistProfile.value.itchData.avatarUrl ? (
                  <img
                    src={artistProfile.value.itchData.avatarUrl}
                    alt={`${artistProfile.value.artist.name}'s avatar`}
                    width={128}
                    height={128}
                    className="rounded-full"
                  />
                ) : (
                  <div className="bg-base-100/20 flex h-full w-full items-center justify-center rounded-full">
                    {/* TODO: Replace with proper icon component */}
                    <svg className="text-base-100 h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-base-100 mb-4 text-4xl font-bold md:text-5xl">
                {artistProfile.value.artist.name}
              </h1>
              <div className="stats stats-horizontal bg-base-100/10 backdrop-blur-sm">
                <div className="stat text-center">
                  <div className="stat-title text-base-100/80 mb-2">
                    Listed Assets
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    {/* TODO: Replace with proper icon component */}
                    <svg className="text-base-100 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                    <div className="stat-value text-base-100">
                      {artistProfile.value.assets.length}
                    </div>
                  </div>
                </div>
                <div className="stat text-center">
                  <div className="stat-title text-base-100/80 mb-2">
                    Featured In Slams
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    {/* TODO: Replace with proper icon component */}
                    <svg className="text-base-100 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="stat-value text-base-100">
                      {artistProfile.value.slams.length}
                    </div>
                  </div>
                </div>
                {artistProfile.value.itchData.followerCount !== null && (
                  <div className="stat text-center">
                    <div className="stat-title text-base-100/80 mb-2">
                      Itch Followers
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-base-100 h-8 w-8"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <div className="stat-value text-base-100">
                        {artistProfile.value.itchData.followerCount}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <a
                  href={artistProfile.value.artist.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-primary"
                >
                  Visit itch.io page
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Assets */}
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              {/* TODO: Replace with proper icon component */}
              <svg className="text-primary h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
              <h2 className="text-2xl font-bold">Assets</h2>
            </div>
            {artistProfile.value.assets.length === 0 ? (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body text-center">
                  <p className="text-base-content/70">No assets found</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {artistProfile.value.assets.map((asset: any) => (
                  <a
                    key={asset.id}
                    href={asset.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="card bg-base-100 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                      <div className="card-body">
                        <h3 className="card-title text-lg">{asset.name}</h3>
                        <div className="flex items-center justify-between">
                          <div className="text-base-content/60 flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                              </svg>
                              <span>View on itch.io</span>
                            </div>
                          </div>
                          <div className="badge badge-primary badge-outline">
                            Asset
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Slams Using Assets */}
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              {/* TODO: Replace with proper icon component */}
              <svg className="text-secondary h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold">Slams Featuring Assets</h2>
            </div>
            {artistProfile.value.slams.length === 0 ? (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body text-center">
                  <p className="text-base-content/70">
                    No slams found using these assets
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {artistProfile.value.slams.map((slam: any) => (
                  <a
                    key={slam.id}
                    href={`/slams/show/${slam.id}`}
                    className="block"
                  >
                    <div className="card bg-base-100 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                      <div className="card-body">
                        <h3 className="card-title text-lg">{slam.name}</h3>
                        <p className="text-base-content/70 mb-4">
                          {slam.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-base-content/60 flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              {/* TODO: Replace with proper icon component */}
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                              </svg>
                              <span>Using: {slam.asset.name}</span>
                            </div>
                            {slam.createdAt && (
                              <div className="flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M8 2v4" />
                                  <path d="M16 2v4" />
                                  <rect
                                    width="18"
                                    height="18"
                                    x="3"
                                    y="4"
                                    rx="2"
                                  />
                                  <path d="M3 10h18" />
                                </svg>
                                <span>
                                  {new Date(
                                    slam.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="badge badge-secondary badge-outline">
                            Featured
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}