import { createServerFn } from '@tanstack/react-start'
import { db } from '~/server-functions/database'
import { slamEntries } from '~/db/schema/slamEntries'
import { users } from '~/db/schema/users'
import { slams } from '~/db/schema/slams'
import { eq, getTableColumns } from 'drizzle-orm'

export const fetchSlamEntries = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const entriesData = await db
      .select({
        entry: getTableColumns(slamEntries),
        user: {
          id: users.id,
          name: users.name,
        },
        slam: {
          id: slams.id,
          name: slams.name,
        },
      })
      .from(slamEntries)
      .leftJoin(users, eq(slamEntries.userId, users.id))
      .leftJoin(slams, eq(slamEntries.slamId, slams.id))
      .orderBy(slamEntries.createdAt)

    return entriesData
  } catch (error) {
    console.error('Error fetching slam entries:', error)
    throw error
  }
})

