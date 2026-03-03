import { createServerFn } from '@tanstack/react-start'
import { db } from '~/server-functions/database'
import { slamEntryRatings } from '~/db/schema/slamEntryRatings'
import { users } from '~/db/schema/users'
import { slamEntries } from '~/db/schema/slamEntries'
import { eq, getTableColumns } from 'drizzle-orm'

export const fetchSlamEntryRatings = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const ratingsData = await db
      .select({
        rating: getTableColumns(slamEntryRatings),
        author: {
          id: users.id,
          name: users.name,
        },
        slamEntry: {
          id: slamEntries.id,
          name: slamEntries.name,
        },
      })
      .from(slamEntryRatings)
      .leftJoin(users, eq(slamEntryRatings.authorId, users.id))
      .leftJoin(slamEntries, eq(slamEntryRatings.slamEntryId, slamEntries.id))
      .where(eq(slamEntryRatings.isDeleted, false))
      .orderBy(slamEntryRatings.createdAt)

    return ratingsData
  } catch (error) {
    console.error('Error fetching slam entry ratings:', error)
    throw error
  }
})

