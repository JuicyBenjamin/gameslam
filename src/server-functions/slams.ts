import { createServerFn } from '@tanstack/react-start'
import { db } from '~/server-functions/database'

import { slams } from '~/db/schema/slams'
import { artists } from '~/db/schema/artists'
import { users } from '~/db/schema/users'
import { slamEntries } from '~/db/schema/slamEntries'
import { eq, getTableColumns, sql } from 'drizzle-orm'

export const fetchSlams = createServerFn({ method: 'GET' }).handler(async () => {
  console.log('Fetching slams on server...')

  try {
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
