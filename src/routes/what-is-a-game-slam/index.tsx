// TODO: Migrate from Qwik component$ to React functional component
// TODO: Replace Qwik Link with TanStack Router Link

// Original Qwik code (commented out for reference):
// import { component$ } from "@builder.io/qwik";
// import { Link } from "@builder.io/qwik-city";
// import {
//   SolarClockCircleLinear,
//   SolarTargetLinear,
//   SolarCheckCircleLinear,
//   SolarPallete2Outline,
//   SolarUsersGroupTwoRoundedLinear,
//   SolarGamepadMinimalisticLinear,
//   SolarChatRoundLinear,
// } from "~/lib/icons";

// export default component$(() => {
//   return (
//     <div class="bg-base-200 min-h-screen">
//       {/* Hero Section */}
//       <div class="hero from-primary to-secondary min-h-[400px] bg-gradient-to-br">
//         <div class="hero-content text-center">
//           <div class="max-w-4xl">
//             <h1 class="text-primary-content mb-6 text-5xl font-bold">
//               What is a Game Slam?
//             </h1>
//             <p class="text-primary-content/90 max-w-3xl text-xl leading-relaxed">
//               A Game Slam is a fun way to practice game development, inspired by
//               game jams but with a more relaxed approach. Instead of rushing to
//               create a complete game, you'll focus on building specific game
//               mechanics and learning as you go.
//             </p>
//           </div>
//         </div>
//       </div>

//       <div class="container mx-auto max-w-6xl px-4 py-12">
//         {/* What Makes Game Slams Different */}
//         <section class="mb-16">
//           <h2 class="text-base-content mb-12 text-center text-4xl font-bold">
//             What Makes Game Slams Different?
//           </h2>

//           <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
//             <div class="card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
//               <div class="card-body text-center">
//                 <div class="mb-4 flex justify-center">
//                   <div class="bg-primary text-primary-content flex h-16 w-16 items-center justify-center rounded-full">
//                     <SolarClockCircleLinear class="h-8 w-8" />
//                   </div>
//                 </div>
//                 <h3 class="card-title mb-4 justify-center text-xl">
//                   Learn at Your Own Pace
//                 </h3>
//                 <p class="text-base-content/80">
//                   Take time to understand and implement game mechanics without
//                   the pressure of a strict deadline.
//                 </p>
//               </div>
//             </div>

//             <div class="card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
//               <div class="card-body text-center">
//                 <div class="mb-4 flex justify-center">
//                   <div class="bg-secondary text-secondary-content flex h-16 w-16 items-center justify-center rounded-full">
//                     <SolarTargetLinear class="h-8 w-8" />
//                   </div>
//                 </div>
//                 <h3 class="card-title mb-4 justify-center text-xl">
//                   Focus on What Matters
//                 </h3>
//                 <p class="text-base-content/80">
//                   Concentrate on making your game mechanics feel good, rather
//                   than trying to build everything at once.
//                 </p>
//               </div>
//             </div>

//             <div class="card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
//               <div class="card-body text-center">
//                 <div class="mb-4 flex justify-center">
//                   <div class="bg-accent text-accent-content flex h-16 w-16 items-center justify-center rounded-full">
//                     <SolarCheckCircleLinear class="h-8 w-8" />
//                   </div>
//                 </div>
//                 <h3 class="card-title mb-4 justify-center text-xl">
//                   Clear Goals
//                 </h3>
//                 <p class="text-base-content/80">
//                   Each slam comes with a simple checklist of what you need to do
//                   to complete it.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* How It Works */}
//         <section class="mb-16">
//           <div class="card bg-base-100 shadow-xl">
//             <div class="card-body">
//               <h2 class="card-title text-base-content mb-8 justify-center text-4xl">
//                 How It Works
//               </h2>

//               <p class="text-base-content/80 mb-8 text-center text-lg">
//                 When you join a Game Slam, you'll get a challenge and a set of
//                 game assets to work with. Here's why this approach is helpful:
//               </p>

//               <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
//                 <div class="bg-primary/10 flex flex-col items-center rounded-lg p-6 text-center">
//                   <div class="mb-4 flex justify-center">
//                     <div class="bg-primary/20 text-primary flex h-12 w-12 items-center justify-center rounded-full">
//                       <SolarPallete2Outline class="h-6 w-6" />
//                     </div>
//                   </div>
//                   <h3 class="text-primary mb-2 text-lg font-bold">
//                     Skip the Art Part
//                   </h3>
//                   <p class="text-base-content/70">
//                     We point you to the game assets, so you can focus on making
//                     the game feel fun to play.
//                   </p>
//                 </div>

//                 <div class="bg-secondary/10 flex flex-col items-center rounded-lg p-6 text-center">
//                   <div class="mb-4 flex justify-center">
//                     <div class="bg-secondary/20 text-secondary flex h-12 w-12 items-center justify-center rounded-full">
//                       <SolarUsersGroupTwoRoundedLinear class="h-6 w-6" />
//                     </div>
//                   </div>
//                   <h3 class="text-secondary mb-2 text-lg font-bold">
//                     Discover New Assets
//                   </h3>
//                   <p class="text-base-content/70">
//                     Each slam features work from game artists, helping you find
//                     cool assets for your future projects.
//                   </p>
//                 </div>

//                 <div class="bg-accent/10 flex flex-col items-center rounded-lg p-6 text-center">
//                   <div class="mb-4 flex justify-center">
//                     <div class="bg-accent/20 text-accent flex h-12 w-12 items-center justify-center rounded-full">
//                       <SolarCheckCircleLinear class="h-6 w-6" />
//                     </div>
//                   </div>
//                   <h3 class="text-accent mb-2 text-lg font-bold">
//                     Know When You're Done
//                   </h3>
//                   <p class="text-base-content/70">
//                     Each challenge has a simple list of requirements, so you
//                     know exactly what you need to build.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Join the Community */}
//         <section class="mb-16">
//           <div class="card from-primary/5 to-secondary/5 bg-gradient-to-br shadow-xl">
//             <div class="card-body">
//               <h2 class="card-title text-base-content mb-8 justify-center text-4xl">
//                 Join the Community
//               </h2>

//               <p class="text-base-content/80 mb-8 text-center text-lg">
//                 Game Slam is a place where you can:
//               </p>

//               <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
//                 <div class="bg-base-100/50 flex items-start space-x-4 rounded-lg p-4">
//                   <div class="flex-shrink-0">
//                     <div class="bg-primary text-primary-content flex h-10 w-10 items-center justify-center rounded-full">
//                       <SolarGamepadMinimalisticLinear class="h-5 w-5" />
//                     </div>
//                   </div>
//                   <div>
//                     <h3 class="mb-1 text-lg font-semibold">
//                       Try New Challenges
//                     </h3>
//                     <p class="text-base-content/70">
//                       Try out new game development challenges
//                     </p>
//                   </div>
//                 </div>

//                 <div class="bg-base-100/50 flex items-start space-x-4 rounded-lg p-4">
//                   <div class="flex-shrink-0">
//                     <div class="bg-secondary text-secondary-content flex h-10 w-10 items-center justify-center rounded-full">
//                       <SolarUsersGroupTwoRoundedLinear class="h-5 w-5" />
//                     </div>
//                   </div>
//                   <div>
//                     <h3 class="mb-1 text-lg font-semibold">Meet Developers</h3>
//                     <p class="text-base-content/70">
//                       Meet other game developers
//                     </p>
//                   </div>
//                 </div>

//                 <div class="bg-base-100/50 flex items-start space-x-4 rounded-lg p-4">
//                   <div class="flex-shrink-0">
//                     <div class="bg-accent text-accent-content flex h-10 w-10 items-center justify-center rounded-full">
//                       <SolarPallete2Outline class="h-5 w-5" />
//                     </div>
//                   </div>
//                   <div>
//                     <h3 class="mb-1 text-lg font-semibold">Find Assets</h3>
//                     <p class="text-base-content/70">
//                       Find game assets for your projects
//                     </p>
//                   </div>
//                 </div>

//                 <div class="bg-base-100/50 flex items-start space-x-4 rounded-lg p-4">
//                   <div class="flex-shrink-0">
//                     <div class="bg-info text-info-content flex h-10 w-10 items-center justify-center rounded-full">
//                       <SolarChatRoundLinear class="h-5 w-5" />
//                     </div>
//                   </div>
//                   <div>
//                     <h3 class="mb-1 text-lg font-semibold">Share Progress</h3>
//                     <p class="text-base-content/70">
//                       Share what you're working on
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* CTA Section */}
//         <section class="text-center">
//           <div class="card from-primary to-secondary bg-gradient-to-r shadow-xl">
//             <div class="card-body items-center">
//               <h3 class="text-primary-content mb-4 text-2xl font-bold">
//                 Ready to Start Your Game Development Journey?
//               </h3>
//               <p class="text-primary-content/90 mb-6 max-w-md">
//                 Join our community and participate in your first Game Slam
//                 today!
//               </p>
//               <Link
//                 href="/slams"
//                 class="btn btn-lg text-primary hover:bg-base-100 border-none bg-white shadow-lg"
//               >
//                 Check Out Current Slams
//               </Link>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// });

import React from 'react';

// TODO: Replace with TanStack Router Link
// import { Link } from '@tanstack/react-router';

export default function WhatIsAGameSlam() {
  return (
    <div className="bg-base-200 min-h-screen">
      {/* Hero Section */}
      <div className="hero from-primary to-secondary min-h-[400px] bg-gradient-to-br">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-primary-content mb-6 text-5xl font-bold">
              What is a Game Slam?
            </h1>
            <p className="text-primary-content/90 max-w-3xl text-xl leading-relaxed">
              A Game Slam is a fun way to practice game development, inspired by
              game jams but with a more relaxed approach. Instead of rushing to
              create a complete game, you'll focus on building specific game
              mechanics and learning as you go.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* What Makes Game Slams Different */}
        <section className="mb-16">
          <h2 className="text-base-content mb-12 text-center text-4xl font-bold">
            What Makes Game Slams Different?
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
              <div className="card-body text-center">
                <div className="mb-4 flex justify-center">
                  <div className="bg-primary text-primary-content flex h-16 w-16 items-center justify-center rounded-full">
                    {/* TODO: Replace with proper icon component */}
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title mb-4 justify-center text-xl">
                  Learn at Your Own Pace
                </h3>
                <p className="text-base-content/80">
                  Take time to understand and implement game mechanics without
                  the pressure of a strict deadline.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
              <div className="card-body text-center">
                <div className="mb-4 flex justify-center">
                  <div className="bg-secondary text-secondary-content flex h-16 w-16 items-center justify-center rounded-full">
                    {/* TODO: Replace with proper icon component */}
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title mb-4 justify-center text-xl">
                  Focus on What Matters
                </h3>
                <p className="text-base-content/80">
                  Concentrate on making your game mechanics feel good, rather
                  than trying to build everything at once.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
              <div className="card-body text-center">
                <div className="mb-4 flex justify-center">
                  <div className="bg-accent text-accent-content flex h-16 w-16 items-center justify-center rounded-full">
                    {/* TODO: Replace with proper icon component */}
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title mb-4 justify-center text-xl">
                  Clear Goals
                </h3>
                <p className="text-base-content/80">
                  Each slam comes with a simple checklist of what you need to do
                  to complete it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-base-content mb-8 justify-center text-4xl">
                How It Works
              </h2>

              <p className="text-base-content/80 mb-8 text-center text-lg">
                When you join a Game Slam, you'll get a challenge and a set of
                game assets to work with. Here's why this approach is helpful:
              </p>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="bg-primary/10 flex flex-col items-center rounded-lg p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="bg-primary/20 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                      {/* TODO: Replace with proper icon component */}
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-primary mb-2 text-lg font-bold">
                    Skip the Art Part
                  </h3>
                  <p className="text-base-content/70">
                    We point you to the game assets, so you can focus on making
                    the game feel fun to play.
                  </p>
                </div>

                <div className="bg-secondary/10 flex flex-col items-center rounded-lg p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="bg-secondary/20 text-secondary flex h-12 w-12 items-center justify-center rounded-full">
                      {/* TODO: Replace with proper icon component */}
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-secondary mb-2 text-lg font-bold">
                    Discover New Assets
                  </h3>
                  <p className="text-base-content/70">
                    Each slam features work from game artists, helping you find
                    cool assets for your future projects.
                  </p>
                </div>

                <div className="bg-accent/10 flex flex-col items-center rounded-lg p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="bg-accent/20 text-accent flex h-12 w-12 items-center justify-center rounded-full">
                      {/* TODO: Replace with proper icon component */}
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-accent mb-2 text-lg font-bold">
                    Know When You're Done
                  </h3>
                  <p className="text-base-content/70">
                    Each challenge has a simple list of requirements, so you
                    know exactly what you need to build.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Join the Community */}
        <section className="mb-16">
          <div className="card from-primary/5 to-secondary/5 bg-gradient-to-br shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-base-content mb-8 justify-center text-4xl">
                Join the Community
              </h2>

              <p className="text-base-content/80 mb-8 text-center text-lg">
                Game Slam is a place where you can:
              </p>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="bg-base-100/50 flex items-start space-x-4 rounded-lg p-4">
                  <div className="flex-shrink-0">
                    <div className="bg-primary text-primary-content flex h-10 w-10 items-center justify-center rounded-full">
                      {/* TODO: Replace with proper icon component */}
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">
                      Try New Challenges
                    </h3>
                    <p className="text-base-content/70">
                      Try out new game development challenges
                    </p>
                  </div>
                </div>

                <div className="bg-base-100/50 flex items-start space-x-4 rounded-lg p-4">
                  <div className="flex-shrink-0">
                    <div className="bg-secondary text-secondary-content flex h-10 w-10 items-center justify-center rounded-full">
                      {/* TODO: Replace with proper icon component */}
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">Meet Developers</h3>
                    <p className="text-base-content/70">
                      Meet other game developers
                    </p>
                  </div>
                </div>

                <div className="bg-base-100/50 flex items-start space-x-4 rounded-lg p-4">
                  <div className="flex-shrink-0">
                    <div className="bg-accent text-accent-content flex h-10 w-10 items-center justify-center rounded-full">
                      {/* TODO: Replace with proper icon component */}
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">Find Assets</h3>
                    <p className="text-base-content/70">
                      Find game assets for your projects
                    </p>
                  </div>
                </div>

                <div className="bg-base-100/50 flex items-start space-x-4 rounded-lg p-4">
                  <div className="flex-shrink-0">
                    <div className="bg-info text-info-content flex h-10 w-10 items-center justify-center rounded-full">
                      {/* TODO: Replace with proper icon component */}
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">Share Progress</h3>
                    <p className="text-base-content/70">
                      Share what you're working on
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="card from-primary to-secondary bg-gradient-to-r shadow-xl">
            <div className="card-body items-center">
              <h3 className="text-primary-content mb-4 text-2xl font-bold">
                Ready to Start Your Game Development Journey?
              </h3>
              <p className="text-primary-content/90 mb-6 max-w-md">
                Join our community and participate in your first Game Slam
                today!
              </p>
              <a
                href="/slams"
                className="btn btn-lg text-primary hover:bg-base-100 border-none bg-white shadow-lg"
              >
                Check Out Current Slams
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}