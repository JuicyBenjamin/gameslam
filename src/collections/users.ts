import { createCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { fetchUsers } from '~/server-functions/users'
import { queryClient } from '~/lib/query-client'

export const usersCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['users'],
    queryFn: async () => {
      const data = await fetchUsers()
      return data
    },
    getKey: item => item.id,
  }),
)
