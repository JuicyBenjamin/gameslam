import { createServerFn } from '@tanstack/react-start'

// Server function for fetching slam details
export const fetchSlamDetails = createServerFn({ method: 'GET' }).handler(async ctx => {
  const slamId = (ctx.data as any)?.slamId || ''
  console.log('Fetching slam details on server for:', slamId)

  try {
    // Import server-side dependencies only inside the server function
    const { db } = await import('~/server-functions/database')
    const { slams, artists, assets, users, slamEntries } = await import('~/db/server-only')
    const { eq, getTableColumns, sql } = await import('drizzle-orm')
    const { alias } = await import('drizzle-orm/pg-core')

    const entryUsers = alias(users, 'entryUsers')

    const slamsResult = await db
      .select({
        slam: getTableColumns(slams),
        artist: getTableColumns(artists),
        asset: getTableColumns(assets),
        createdBy: getTableColumns(users),
        entries: getTableColumns(slamEntries),
        entryUser: {
          id: entryUsers.id,
          name: entryUsers.name,
        },
      })
      .from(slams)
      .where(eq(slams.id, slamId))
      .leftJoin(artists, eq(slams.artistId, artists.id))
      .leftJoin(assets, eq(slams.assetId, assets.id))
      .leftJoin(users, eq(slams.createdBy, users.id))
      .leftJoin(slamEntries, eq(slamEntries.slamId, slams.id))
      .leftJoin(entryUsers, eq(slamEntries.userId, entryUsers.id))

    const slam = {
      ...slamsResult[0],
      entries: slamsResult
        .map(row =>
          row.entries
            ? {
                ...row.entries,
                user: row.entryUser,
              }
            : null,
        )
        .filter(entry => entry !== null),
    }

    return slam
  } catch (error) {
    console.error('Error fetching slam details:', error)
    throw error
  }
})
