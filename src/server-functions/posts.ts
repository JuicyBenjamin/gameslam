import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import axios from 'redaxios'

export interface IPost {
  id: string
  title: string
  body: string
}

export const fetchPost = createServerFn({ method: 'GET' })
  .inputValidator((data: { postId: IPost['id'] }) => data)
  .handler(async ({ data }) => {
    const { postId } = data
    const post = await axios
      .get<IPost>(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then(response => response.data)
      .catch(error => {
        console.error(error)
        if (error.status === 404) {
          throw notFound()
        }
        throw error
      })

    return post
  })

export const fetchPosts = createServerFn({ method: 'GET' }).handler(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return axios.get<Array<IPost>>('https://jsonplaceholder.typicode.com/posts').then(response => response.data.slice(0, 10))
})
