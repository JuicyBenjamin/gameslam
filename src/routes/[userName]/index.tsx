import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { getUserByName } from "~/db/queries/users";
import { db } from "~/db";
import { slams } from "~/db/schema/slams";
import { slamEntries } from "~/db/schema/slamEntries";
import { eq } from "drizzle-orm";

export const useUserProfile = routeLoader$(async (requestEvent) => {
  const userName = requestEvent.params.userName;
  const user = await getUserByName(userName);

  if (!user) {
    throw requestEvent.error(404, "User not found");
  }

  // Get slams created by the user
  const createdSlams = await db
    .select()
    .from(slams)
    .where(eq(slams.createdBy, user.id));

  // Get slams the user is participating in
  const participatingSlams = await db
    .select({
      slam: slams,
    })
    .from(slamEntries)
    .innerJoin(slams, eq(slamEntries.slamId, slams.id))
    .where(eq(slamEntries.userId, user.id));

  return {
    user,
    createdSlams,
    participatingSlams: participatingSlams.map((s) => s.slam),
  };
});

export default component$(() => {
  const userProfile = useUserProfile();

  return (
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <div class="flex items-center gap-4">
          <img
            src={userProfile.value.user.avatarLink}
            alt={`${userProfile.value.user.name}'s avatar`}
            class="h-24 w-24 rounded-full"
            width="96"
            height="96"
          />
          <div>
            <h1 class="text-3xl font-bold">{userProfile.value.user.name}</h1>
            {userProfile.value.user.isVerified && (
              <span class="text-blue-500">✓ Verified</span>
            )}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 class="mb-4 text-2xl font-bold">Created Slams</h2>
          {userProfile.value.createdSlams.length === 0 ? (
            <p class="text-gray-500">No slams created yet</p>
          ) : (
            <div class="space-y-4">
              {userProfile.value.createdSlams.map((slam) => (
                <Link
                  key={slam.id}
                  href={`/slams/show/${slam.id}`}
                  class="block rounded-lg border p-4 transition-colors hover:border-blue-500"
                >
                  <h3 class="text-xl font-semibold">{slam.name}</h3>
                  <p class="mt-2 text-gray-600">{slam.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 class="mb-4 text-2xl font-bold">Participating Slams</h2>
          {userProfile.value.participatingSlams.length === 0 ? (
            <p class="text-gray-500">Not participating in any slams</p>
          ) : (
            <div class="space-y-4">
              {userProfile.value.participatingSlams.map((slam) => (
                <Link
                  key={slam.id}
                  href={`/slams/show/${slam.id}`}
                  class="block rounded-lg border p-4 transition-colors hover:border-blue-500"
                >
                  <h3 class="text-xl font-semibold">{slam.name}</h3>
                  <p class="mt-2 text-gray-600">{slam.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
