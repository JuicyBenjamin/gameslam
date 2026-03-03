import { createServerFn } from '@tanstack/react-start'
import { db } from '~/server-functions/database'
import { users } from '~/db/schema/users'

export const fetchUsers = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const usersData = await db.select().from(users).orderBy(users.name)

    return usersData
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
})

