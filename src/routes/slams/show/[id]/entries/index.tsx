import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { db, logQuery, printQueryStats } from "~/db/logger";
import { slamEntries } from "~/db/schema/slamEntries";
import { users } from "~/db/schema/users";
import { eq } from "drizzle-orm";

export const useSlamEntries = routeLoader$(async (requestEvent) => {
  const slamId = requestEvent.params.id;

  // Add caching to prevent duplicate queries
  requestEvent.cacheControl({
    // Cache for 1 minute
    maxAge: 60,
    staleWhileRevalidate: 15,
  });

  const entries = await logQuery("getSlamEntries", async () => {
    return await db
      .select({
        entry: slamEntries,
        user: users,
      })
      .from(slamEntries)
      .where(eq(slamEntries.slamId, slamId))
      .leftJoin(users, eq(slamEntries.userId, users.id));
  });

  // Print statistics at the end of this request
  printQueryStats();

  return entries;
});

export default component$(() => {
  const entries = useSlamEntries();

  return (
    <div class="bg-base-200 min-h-screen p-8">
      <div class="mx-auto max-w-4xl">
        <Link
          href=".."
          class="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-white transition duration-300 hover:bg-white/20"
        >
          ← Back to Slam
        </Link>
        <div class="mb-8">
          <h1 class="text-3xl font-bold">Slam Entries</h1>
        </div>

        {entries.value.length === 0 ? (
          <div class="bg-base-100 rounded-lg p-8 text-center">
            <p class="text-lg text-gray-600">No entries yet</p>
          </div>
        ) : (
          <div class="grid gap-4">
            {entries.value.map(({ entry, user }) => (
              <div key={entry.id} class="card bg-base-100 shadow-xl">
                <div class="card-body">
                  <h2 class="card-title">{entry.name}</h2>
                  <p class="text-gray-600">{entry.description}</p>
                  <div class="mt-4 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="text-sm text-gray-500">By</span>
                      <Link
                        href={`/${user?.name}`}
                        class="font-medium hover:underline"
                      >
                        {user?.name}
                      </Link>
                    </div>
                    <a
                      href={entry.linkToEntry}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn btn-primary"
                    >
                      Play Game
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
