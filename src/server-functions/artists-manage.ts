import { createServerFn } from '@tanstack/react-start'
import { object, string, pipe, nonEmpty, url, safeParse } from 'valibot'
import { getSession } from '@/server-functions/auth.server'
import { prisma } from '@/lib/prisma.server'

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

    const session = await getSession()
    if (session == null) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    const artist = await prisma.artist.upsert({
      where: { name: result.output.artistName },
      update: { link: result.output.artistLink },
      create: { name: result.output.artistName, link: result.output.artistLink },
    })

    const asset = await prisma.asset.create({
      data: { name: result.output.name, link: result.output.link },
    })

    await prisma.artistAsset.create({
      data: { artistId: artist.id, assetId: asset.id },
    })

    return { status: 'success' as const, assetId: asset.id, artistId: artist.id }
  })

const UpdateArtistSchema = object({
  artistId: pipe(string(), nonEmpty()),
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

    const session = await getSession()
    if (session == null) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    const nameTaken = await prisma.artist.findUnique({
      where: { name: result.output.name },
    })

    if (nameTaken != null && nameTaken.id !== result.output.artistId) {
      return { status: 'error' as const, message: 'An artist with this name already exists' }
    }

    const updated = await prisma.artist.update({
      where: { id: result.output.artistId },
      data: { name: result.output.name, link: result.output.link },
    }).catch(() => null)

    if (updated == null) {
      return { status: 'error' as const, message: 'Artist not found' }
    }

    return { status: 'success' as const }
  })

const UpdateAssetSchema = object({
  assetId: pipe(string(), nonEmpty()),
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

    const session = await getSession()
    if (session == null) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    const updated = await prisma.asset.update({
      where: { id: result.output.assetId },
      data: { name: result.output.name, link: result.output.link },
    }).catch(() => null)

    if (updated == null) {
      return { status: 'error' as const, message: 'Asset not found' }
    }

    return { status: 'success' as const }
  })

export const deleteAssetFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { assetId: string; artistId: string }) => data)
  .handler(async ({ data }) => {
    const session = await getSession()
    if (session == null) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    await prisma.artistAsset.delete({
      where: {
        artistId_assetId: {
          artistId: data.artistId,
          assetId: data.assetId,
        },
      },
    })

    return { status: 'success' as const }
  })
