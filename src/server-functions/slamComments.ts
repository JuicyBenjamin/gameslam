import { createServerFn } from '@tanstack/react-start'
import { db } from '~/server-functions/database'
import { slamComments } from '~/db/schema/slamComments'
import { users } from '~/db/schema/users'
import { slamEntries } from '~/db/schema/slamEntries'
import { eq, getTableColumns } from 'drizzle-orm'

export const fetchSlamComments = createServerFn({ method: 'GET' }).handler(async () => {
  console.log('Fetching slam comments on server...')

  try {
    const commentsData = await db
      .select({
        comment: getTableColumns(slamComments),
        author: {
          id: users.id,
          name: users.name,
        },
        slamEntry: {
          id: slamEntries.id,
          name: slamEntries.name,
        },
      })
      .from(slamComments)
      .leftJoin(users, eq(slamComments.authorId, users.id))
      .leftJoin(slamEntries, eq(slamComments.slameEntryId, slamEntries.id))
      .where(eq(slamComments.isDeleted, false))
      .orderBy(slamComments.createdAt)

    return commentsData
  } catch (error) {
    console.error('Error fetching slam comments:', error)
    throw error
  }
})

