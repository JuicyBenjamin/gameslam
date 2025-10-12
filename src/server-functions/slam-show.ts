import { createServerFn } from '@tanstack/react-start'
import { db } from '~/server-functions/database'
import { slams } from '~/db/schema/slams'
import { artists } from '~/db/schema/artists'
import { assets } from '~/db/schema/assets'
import { users } from '~/db/schema/users'
import { slamEntries } from '~/db/schema/slamEntries'
import { eq, getTableColumns, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

// Server function for fetching slam details
export const fetchSlamDetails = createServerFn({ method: 'GET' }).handler(async ctx => {
  const slamId = (ctx.data as any)?.slamId || ''
  console.log('Fetching slam details on server for:', slamId)

  try {
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
