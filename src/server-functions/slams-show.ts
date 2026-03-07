import { createServerFn } from '@tanstack/react-start'
import { object, string, pipe, nonEmpty, url, custom, safeParse } from 'valibot'
import { parse as parseHtml } from 'node-html-parser'
import { getSession } from '@/server-functions/auth.server'
import { prisma } from '@/lib/prisma.server'

interface IItchPageData {
  name: string
  description: string
}

async function fetchItchPageData(pageUrl: string): Promise<IItchPageData> {
  const response = await fetch(pageUrl, {
    headers: { 'User-Agent': 'GameSlam/1.0 (+https://gameslam.io)' },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch itch.io page (${response.status})`)
  }

  const html = await response.text()
  const root = parseHtml(html)

  const ogTitle = root.querySelector('meta[property="og:title"]')?.getAttribute('content')
  const twitterTitle = root.querySelector('meta[name="twitter:title"]')?.getAttribute('content')
  const titleTag = root.querySelector('title')?.textContent

  const ogDescription = root.querySelector('meta[property="og:description"]')?.getAttribute('content')
  const metaDescription = root.querySelector('meta[name="description"]')?.getAttribute('content')

  const name = ogTitle
    ?? twitterTitle
    ?? titleTag?.replace(/\s+by\s+.+$/, '')
    ?? 'Untitled'

  const description = ogDescription
    ?? metaDescription
    ?? 'No description provided'

  return { name: name.trim(), description: description.trim() }
}

const JoinSlamSchema = object({
  itchIoLink: pipe(
    string(),
    nonEmpty('Itch.io link is required'),
    url('Must be a valid URL'),
    custom(input => {
      if (typeof input !== 'string') return false
      return input.includes('itch.io')
    }, 'Must be an itch.io URL'),
  ),
})

export const joinSlamFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { itchIoLink: string; slamId: string }) => data)
  .handler(async ({ data }) => {
    const result = safeParse(JoinSlamSchema, { itchIoLink: data.itchIoLink })
    if (!result.success) {
      return {
        status: 'error' as const,
        message: result.issues[0]?.message || 'Invalid form data',
      }
    }

    const session = await getSession()
    if (session == null) {
      return {
        status: 'error' as const,
        message: 'You must be logged in to join a slam',
      }
    }

    let itchData: IItchPageData
    try {
      itchData = await fetchItchPageData(result.output.itchIoLink)
    } catch {
      return {
        status: 'error' as const,
        message: 'Could not fetch data from the itch.io page. Please check the URL and try again.',
      }
    }

    await prisma.slamEntry.create({
      data: {
        slamId: data.slamId,
        userId: session.user.id,
        linkToEntry: result.output.itchIoLink,
        name: itchData.name,
        description: itchData.description,
      },
    })

    return {
      status: 'success' as const,
      message: 'Successfully joined the slam!',
    }
  })
