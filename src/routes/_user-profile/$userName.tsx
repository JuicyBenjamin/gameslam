// TODO: Migrate from Qwik component$ to React functional component
// TODO: Replace Qwik routeLoader$ with TanStack Router loader
// TODO: Replace Qwik Link with TanStack Router Link
// TODO: Replace Qwik route parameters with TanStack Router params

// Original Qwik code (commented out for reference):
// import { component$ } from "@builder.io/qwik";
// import { Link, routeLoader$ } from "@builder.io/qwik-city";
// import { getUserByName } from "~/db/queries/users";
// import { db, logQuery, printQueryStats } from "~/db/logger";
// import { slams } from "~/db/schema/slams";
// import { slamEntries } from "~/db/schema/slamEntries";
// import { eq, sql } from "drizzle-orm";
// import {
//   SolarMedalStarLinear,
//   SolarGamepadMinimalisticLinear,
// } from "~/lib/icons";

// export const useUserProfile = routeLoader$(async (requestEvent) => {
//   const userName = requestEvent.params.userName;

//   // Add caching to prevent duplicate queries
//   requestEvent.cacheControl({
//     // Cache for 1 minute
//     maxAge: 60,
//     staleWhileRevalidate: 15,
//   });

//   const user = await getUserByName(userName);

//   if (!user) {
//     throw requestEvent.error(404, "User not found");
//   }

//   // Get slams created by the user with participant counts
//   const createdSlams = await logQuery("getUserCreatedSlams", async () => {
//     return await db
//       .select({
//         slam: slams,
//         participantCount: sql<number>`cast(count(${slamEntries.id}) as int)`,
//       })
//       .from(slams)
//       .leftJoin(slamEntries, eq(slamEntries.slamId, slams.id))
//       .where(eq(slams.createdBy, user.id))
//       .groupBy(slams.id);
//   });

//   // Get slams the user is participating in
//   const participatingSlams = await logQuery(
//     "getUserParticipatingSlams",
//     async () => {
//       return await db
//         .select({
//           slam: slams,
//           entryId: slamEntries.id,
//         })
//         .from(slamEntries)
//         .innerJoin(slams, eq(slamEntries.slamId, slams.id))
//         .where(eq(slamEntries.userId, user.id));
//     },
//   );

//   const result = {
//     user,
//     createdSlams: createdSlams.map((s) => ({
//       ...s.slam,
//       participantCount: s.participantCount,
//     })),
//     participatingSlams: participatingSlams.map((s) => ({
//       ...s.slam,
//       entryId: s.entryId,
//     })),
//   };

//   // Print statistics at the end of this request
//   printQueryStats();

//   return result;
// });

// export default component$(() => {
//   const userProfile = useUserProfile();

//   return (
//     <div class="bg-base-200 min-h-screen">
//       {/* Hero Section */}
//       <div class="from-primary to-secondary bg-gradient-to-br">
//         <div class="container mx-auto px-4 py-12">
//           <div class="flex flex-col items-center gap-8 md:flex-row">
//             <div class="avatar">
//               <div class="ring-base-100 ring-offset-base-100 h-32 w-32 rounded-full ring ring-offset-4">
//                 <img
//                   src={userProfile.value.user.avatarLink}
//                   alt={`${userProfile.value.user.name}'s avatar`}
//                   width={128}
//                   height={128}
//                   class="rounded-full"
//                 />
//               </div>
//             </div>
//             <div class="text-center md:text-left">
//               <h1 class="text-base-100 mb-4 text-4xl font-bold md:text-5xl">
//                 {userProfile.value.user.name}
//                 {userProfile.value.user.isVerified && (
//                   <span class="text-primary-content ml-2">✓</span>
//                 )}
//               </h1>
//               <div class="stats stats-horizontal bg-base-100/10 backdrop-blur-sm">
//                 <div class="stat">
//                   <div class="stat-figure text-primary-content">
//                     <SolarMedalStarLinear
//                       class="h-8 w-8"
//                       key="medal-stat-icon"
//                     />
//                   </div>
//                   <div class="stat-title text-base-100/80">Created</div>
//                   <div class="stat-value text-base-100">
//                     {userProfile.value.createdSlams.length}
//                   </div>
//                   <div class="stat-desc text-base-100/60">Slams</div>
//                 </div>
//                 <div class="stat">
//                   <div class="stat-figure text-primary-content">
//                     <SolarGamepadMinimalisticLinear
//                       class="h-8 w-8"
//                       key="gamepad-stat-icon"
//                     />
//                   </div>
//                   <div class="stat-title text-base-100/80">Participating</div>
//                   <div class="stat-value text-base-100">
//                     {userProfile.value.participatingSlams.length}
//                   </div>
//                   <div class="stat-desc text-base-100/60">Slams</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Content Section */}
//       <div class="container mx-auto px-4 py-12">
//         <div class="grid gap-8 lg:grid-cols-2">
//           {/* Created Slams */}
//           <div class="space-y-6">
//             <div class="mb-6 flex items-center gap-3">
//               <SolarMedalStarLinear
//                 class="text-primary h-6 w-6"
//                 key="medal-icon"
//               />
//               <h2 class="text-2xl font-bold">Created Slams</h2>
//             </div>
//             {userProfile.value.createdSlams.length === 0 ? (
//               <div class="card bg-base-100 shadow-lg">
//                 <div class="card-body text-center">
//                   <p class="text-base-content/70">No slams created yet</p>
//                 </div>
//               </div>
//             ) : (
//               <div class="space-y-4">
//                 {userProfile.value.createdSlams.map((slam) => (
//                   <Link
//                     key={`created-${slam.id}`}
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
//                                 <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//                                 <circle cx="9" cy="7" r="4" />
//                                 <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
//                                 <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//                               </svg>
//                               <span>
//                                 {slam.participantCount}{" "}
//                                 {slam.participantCount === 1
//                                   ? "participant"
//                                   : "participants"}
//                               </span>
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
//                           <div class="badge badge-primary badge-outline">
//                             {slam.participantCount === 0
//                               ? "Common"
//                               : slam.participantCount <= 10
//                                 ? "Epic"
//                                 : slam.participantCount <= 20
//                                   ? "Legendary"
//                                   : "Mythic"}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Participating Slams */}
//           <div class="space-y-6">
//             <div class="mb-6 flex items-center gap-3">
//               <SolarGamepadMinimalisticLinear
//                 class="text-secondary h-6 w-6"
//                 key="gamepad-header-icon"
//               />
//               <h2 class="text-2xl font-bold">Participating Slams</h2>
//             </div>
//             {userProfile.value.participatingSlams.length === 0 ? (
//               <div class="card bg-base-100 shadow-lg">
//                 <div class="card-body text-center">
//                   <p class="text-base-content/70">
//                     Not participating in any slams
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <div class="space-y-4">
//                 {userProfile.value.participatingSlams.map((slam) => (
//                   <Link
//                     key={`participating-${slam.entryId}`}
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
//                             Submitted
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
import { getUserByName } from "~/db/queries/users";
import { db, logQuery, printQueryStats } from "~/db/logger";
import { slams } from "~/db/schema/slams";
import { slamEntries } from "~/db/schema/slamEntries";
import { eq, sql } from "drizzle-orm";

// TODO: Replace with TanStack Router Link
// import { Link } from '@tanstack/react-router';

// TODO: Replace with TanStack Router loader
// export const useUserProfile = routeLoader$(async (requestEvent) => {
//   const userName = requestEvent.params.userName;
//   // ... rest of the loader logic
// });

export default function UserProfile() {
  // TODO: Replace with TanStack Router loader and params
  // const userProfile = useUserProfile();
  const userProfile = {
    value: {
      user: { name: "Mock User", avatarLink: "#", isVerified: false },
      createdSlams: [],
      participatingSlams: []
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
                <img
                  src={userProfile.value.user.avatarLink}
                  alt={`${userProfile.value.user.name}'s avatar`}
                  width={128}
                  height={128}
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-base-100 mb-4 text-4xl font-bold md:text-5xl">
                {userProfile.value.user.name}
                {userProfile.value.user.isVerified && (
                  <span className="text-primary-content ml-2">✓</span>
                )}
              </h1>
              <div className="stats stats-horizontal bg-base-100/10 backdrop-blur-sm">
                <div className="stat">
                  <div className="stat-figure text-primary-content">
                    {/* TODO: Replace with proper icon component */}
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="stat-title text-base-100/80">Created</div>
                  <div className="stat-value text-base-100">
                    {userProfile.value.createdSlams.length}
                  </div>
                  <div className="stat-desc text-base-100/60">Slams</div>
                </div>
                <div className="stat">
                  <div className="stat-figure text-primary-content">
                    {/* TODO: Replace with proper icon component */}
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="stat-title text-base-100/80">Participating</div>
                  <div className="stat-value text-base-100">
                    {userProfile.value.participatingSlams.length}
                  </div>
                  <div className="stat-desc text-base-100/60">Slams</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Created Slams */}
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              {/* TODO: Replace with proper icon component */}
              <svg className="text-primary h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <h2 className="text-2xl font-bold">Created Slams</h2>
            </div>
            {userProfile.value.createdSlams.length === 0 ? (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body text-center">
                  <p className="text-base-content/70">No slams created yet</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {userProfile.value.createdSlams.map((slam: any) => (
                  <a
                    key={`created-${slam.id}`}
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
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                              </svg>
                              <span>
                                {slam.participantCount}{" "}
                                {slam.participantCount === 1
                                  ? "participant"
                                  : "participants"}
                              </span>
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
                          <div className="badge badge-primary badge-outline">
                            {slam.participantCount === 0
                              ? "Common"
                              : slam.participantCount <= 10
                                ? "Epic"
                                : slam.participantCount <= 20
                                  ? "Legendary"
                                  : "Mythic"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Participating Slams */}
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              {/* TODO: Replace with proper icon component */}
              <svg className="text-secondary h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold">Participating Slams</h2>
            </div>
            {userProfile.value.participatingSlams.length === 0 ? (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body text-center">
                  <p className="text-base-content/70">
                    Not participating in any slams
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {userProfile.value.participatingSlams.map((slam: any) => (
                  <a
                    key={`participating-${slam.entryId}`}
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
                            Submitted
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