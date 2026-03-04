import { createServerFn } from '@tanstack/react-start'
import { db } from '~/server-functions/database'
import { slamRatings } from '~/db/schema/slamRatings'
import { users } from '~/db/schema/users'
import { slamEntries } from '~/db/schema/slamEntries'
import { eq, getTableColumns } from 'drizzle-orm'

export const fetchSlamRatings = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const ratingsData = await db
      .select({
        rating: getTableColumns(slamRatings),
        author: {
          id: users.id,
          name: users.name,
        },
        slamEntry: {
          id: slamEntries.id,
          name: slamEntries.name,
        },
      })
      .from(slamRatings)
      .leftJoin(users, eq(slamRatings.authorId, users.id))
      .leftJoin(slamEntries, eq(slamRatings.slamEntryId, slamEntries.id))
      .where(eq(slamRatings.isDeleted, false))
      .orderBy(slamRatings.createdAt)

    return ratingsData
  } catch (error) {
    console.error('Error fetching slam ratings:', error)
    throw error
  }
})

