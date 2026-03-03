import { createServerFn } from '@tanstack/react-start'
import { db } from '~/server-functions/database'
import { assets } from '~/db/schema/assets'

export const fetchAssets = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const assetsData = await db.select().from(assets).orderBy(assets.name)

    return assetsData
  } catch (error) {
    console.error('Error fetching assets:', error)
    throw error
  }
})

