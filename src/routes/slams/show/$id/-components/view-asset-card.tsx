import { useLoaderData } from '@tanstack/react-router'
import { Package, ExternalLink } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'
import { Card, CardContent } from '@/components/ui/card'

export const ViewAssetCard = () => {
  const loaderData = useLoaderData({ from: '/slams/show/$id/' })
  const { asset } = loaderData.slam

  if (!asset) return null

  return (
    <Card>
      <CardContent className="p-6 text-center">
        <Package className="mx-auto h-12 w-12 text-primary mb-4" />
        <h3 className="text-xl font-bold mb-4">View Asset</h3>
        <p className="mb-6 text-muted-foreground">
          Check out the asset that inspired this game slam challenge.
        </p>
        <ButtonLink href={asset.link} target="_blank" rel="noopener noreferrer" variant="outline" size="lg" className="w-full">
          <ExternalLink className="mr-2 h-4 w-4" />
          Go to Asset
        </ButtonLink>
      </CardContent>
    </Card>
  )
}
