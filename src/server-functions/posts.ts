import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import axios from 'redaxios'

export interface IPost {
  id: string
  title: string
  body: string
}

export const fetchPost = createServerFn({ method: 'GET' }).handler(async ctx => {
  const postId = (ctx.data as any)?.postId || ''
  console.info(`Fetching post with id ${postId}...`)
  const post = await axios
    .get<IPost>(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then(r => r.data)
    .catch(err => {
      console.error(err)
      if (err.status === 404) {
        throw notFound()
      }
      throw err
    })

  return post
})

export const fetchPosts = createServerFn({ method: 'GET' }).handler(async () => {
  console.info('Fetching posts...')
  await new Promise(r => setTimeout(r, 1000))
  return axios.get<Array<IPost>>('https://jsonplaceholder.typicode.com/posts').then(r => r.data.slice(0, 10))
})
