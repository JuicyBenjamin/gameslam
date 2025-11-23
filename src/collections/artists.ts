import { createCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { fetchArtists } from '~/server-functions/artists'
import { queryClient } from '~/lib/query-client'

export const artistsCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['artists'],
    queryFn: async () => {
      const data = await fetchArtists()
      return data
    },
    getKey: item => item.artist.name,
  }),
)
