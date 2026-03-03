import { createServerFn } from '@tanstack/react-start'
import { db } from '~/server-functions/database'
import { slamEntryComments } from '~/db/schema/slamEntryComments'
import { users } from '~/db/schema/users'
import { slamEntries } from '~/db/schema/slamEntries'
import { eq, getTableColumns } from 'drizzle-orm'

export const fetchSlamEntryComments = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const commentsData = await db
      .select({
        comment: getTableColumns(slamEntryComments),
        author: {
          id: users.id,
          name: users.name,
        },
        slamEntry: {
          id: slamEntries.id,
          name: slamEntries.name,
        },
      })
      .from(slamEntryComments)
      .leftJoin(users, eq(slamEntryComments.authorId, users.id))
      .leftJoin(slamEntries, eq(slamEntryComments.slameEntryId, slamEntries.id))
      .where(eq(slamEntryComments.isDeleted, false))
      .orderBy(slamEntryComments.createdAt)

    return commentsData
  } catch (error) {
    console.error('Error fetching slam entry comments:', error)
    throw error
  }
})

