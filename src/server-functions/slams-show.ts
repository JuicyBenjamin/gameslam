import { createServerFn } from '@tanstack/react-start'
import { object, string, pipe, nonEmpty, url, custom, safeParse } from 'valibot'
import { parse as parseHtml } from 'node-html-parser'
import { supabase } from '@/lib/supabase.server'
import { slamEntries } from '@/db/schema/slamEntries'
import { db } from '@/server-functions/database'

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

    const supabaseClient = supabase()
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user?.id) {
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

    await db.insert(slamEntries).values({
      slamId: data.slamId,
      userId: user.id,
      linkToEntry: result.output.itchIoLink,
      name: itchData.name,
      description: itchData.description,
    })

    return {
      status: 'success' as const,
      message: 'Successfully joined the slam!',
    }
  })
