import { createServerFn } from '@tanstack/react-start'
import { object, string, pipe, nonEmpty, url, uuid, safeParse } from 'valibot'
import { supabase } from '@/lib/supabase.server'
import { artists } from '@/db/schema/artists'
import { assets } from '@/db/schema/assets'
import { artistAssets } from '@/db/schema/artistAssets'
import { db } from '@/server-functions/database'
import { eq, and } from 'drizzle-orm'

const CreateAssetSchema = object({
  name: pipe(string(), nonEmpty('Asset name is required')),
  link: pipe(string(), nonEmpty('Link is required'), url('Must be a valid URL')),
  artistName: pipe(string(), nonEmpty('Artist name is required')),
  artistLink: pipe(string(), nonEmpty('Artist link is required'), url('Must be a valid URL')),
})

export const createAssetFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { name: string; link: string; artistName: string; artistLink: string }) => data,
  )
  .handler(async ({ data }) => {
    const result = safeParse(CreateAssetSchema, data)
    if (!result.success) {
      return {
        status: 'error' as const,
        message: result.issues[0]?.message || 'Invalid form data',
      }
    }

    const supabaseClient = supabase()
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user?.id) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    const [artist] = await db
      .insert(artists)
      .values({
        name: result.output.artistName,
        link: result.output.artistLink,
      })
      .onConflictDoUpdate({
        target: artists.name,
        set: { link: result.output.artistLink },
      })
      .returning({ id: artists.id })

    const [asset] = await db
      .insert(assets)
      .values({
        name: result.output.name,
        link: result.output.link,
      })
      .returning({ id: assets.id })

    await db.insert(artistAssets).values({
      artistId: artist.id,
      assetId: asset.id,
    })

    return { status: 'success' as const, assetId: asset.id, artistId: artist.id }
  })

const UpdateArtistSchema = object({
  artistId: pipe(string(), nonEmpty(), uuid()),
  name: pipe(string(), nonEmpty('Artist name is required')),
  link: pipe(string(), nonEmpty('Link is required'), url('Must be a valid URL')),
})

export const updateArtistFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { artistId: string; name: string; link: string }) => data)
  .handler(async ({ data }) => {
    const result = safeParse(UpdateArtistSchema, data)
    if (!result.success) {
      return {
        status: 'error' as const,
        message: result.issues[0]?.message || 'Invalid form data',
      }
    }

    const supabaseClient = supabase()
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user?.id) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    const nameTaken = await db
      .select()
      .from(artists)
      .where(eq(artists.name, result.output.name))
      .limit(1)

    if (nameTaken.length > 0 && nameTaken[0].id !== result.output.artistId) {
      return { status: 'error' as const, message: 'An artist with this name already exists' }
    }

    const [updated] = await db
      .update(artists)
      .set({ name: result.output.name, link: result.output.link })
      .where(eq(artists.id, result.output.artistId))
      .returning({ id: artists.id })

    if (!updated) {
      return { status: 'error' as const, message: 'Artist not found' }
    }

    return { status: 'success' as const }
  })

const UpdateAssetSchema = object({
  assetId: pipe(string(), nonEmpty(), uuid()),
  name: pipe(string(), nonEmpty('Asset name is required')),
  link: pipe(string(), nonEmpty('Link is required'), url('Must be a valid URL')),
})

export const updateAssetFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { assetId: string; name: string; link: string }) => data)
  .handler(async ({ data }) => {
    const result = safeParse(UpdateAssetSchema, data)
    if (!result.success) {
      return {
        status: 'error' as const,
        message: result.issues[0]?.message || 'Invalid form data',
      }
    }

    const supabaseClient = supabase()
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user?.id) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    const [updated] = await db
      .update(assets)
      .set({ name: result.output.name, link: result.output.link })
      .where(eq(assets.id, result.output.assetId))
      .returning({ id: assets.id })

    if (!updated) {
      return { status: 'error' as const, message: 'Asset not found' }
    }

    return { status: 'success' as const }
  })

export const deleteAssetFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { assetId: string; artistId: string }) => data)
  .handler(async ({ data }) => {
    const supabaseClient = supabase()
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user?.id) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    await db
      .delete(artistAssets)
      .where(and(eq(artistAssets.assetId, data.assetId), eq(artistAssets.artistId, data.artistId)))

    return { status: 'success' as const }
  })
