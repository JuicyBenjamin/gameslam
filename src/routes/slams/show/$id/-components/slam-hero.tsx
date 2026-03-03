import { useLoaderData } from '@tanstack/react-router'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { useParams } from '@tanstack/react-router'
import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { slamsCollection } from '@/collections'

export const SlamHero = () => {
  const { id: slamId } = useParams({ from: '/slams/show/$id/' })
  const loaderData = useLoaderData({ from: '/slams/show/$id/' })

  const { data: slams = [] } = useLiveQuery(query =>
    query.from({ slamItem: slamsCollection }).where(({ slamItem }) => eq(slamItem.slam.id, slamId)),
  )

  const slam = slams[0]?.slam || loaderData.slam.slam

  return (
    <div className="mb-12 text-center">
      <Badge variant="secondary" className="mb-4">
        <Clock className="mr-1 h-3 w-3" />
        Active
      </Badge>
      <h1 className="mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
        {slam.name}
      </h1>
      <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {slam.description}
      </p>
    </div>
  )
}
