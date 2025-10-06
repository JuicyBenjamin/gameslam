import { createServerFn } from '@tanstack/react-start'

export const fetchSlams = createServerFn({ method: 'GET' }).handler(async () => {
  console.log('Fetching slams on server...')

  try {
    // Import server-side dependencies only inside the server function
    const { db } = await import('~/server-functions/database')
    const { slams, artists, users, slamEntries } = await import('~/db/server-only')
    const { eq, getTableColumns, sql } = await import('drizzle-orm')

    const result = await db
      .select({
        slam: getTableColumns(slams),
        artist: {
          id: artists.id,
          name: artists.name,
        },
        creator: {
          id: users.id,
          name: users.name,
        },
        entryCount: sql<number>`(
          SELECT COUNT(*)::int
          FROM ${slamEntries}
          WHERE ${slamEntries.slamId} = ${slams.id}
        )`,
      })
      .from(slams)
      .leftJoin(artists, eq(slams.artistId, artists.id))
      .leftJoin(users, eq(slams.createdBy, users.id))
      .orderBy(slams.createdAt)

    return result
  } catch (error) {
    console.error('Error fetching slams:', error)
    throw error
  }
})
