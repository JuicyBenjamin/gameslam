import { createCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { fetchSlamEntries } from '~/server-functions/slamEntries'
import { queryClient } from '~/lib/query-client'

export const slamEntriesCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['slamEntries'],
    queryFn: async () => {
      const data = await fetchSlamEntries()
      return data
    },
    getKey: item => item.entry.id,
  }),
)
