import { createCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { fetchAssets } from '~/server-functions/assets'
import { queryClient } from '~/lib/query-client'

export const assetsCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['assets'],
    queryFn: async () => {
      const data = await fetchAssets()
      return data
    },
    getKey: item => item.id,
  }),
)
