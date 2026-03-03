import { useParams, useLoaderData } from '@tanstack/react-router'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { artistsCollection } from '@/collections'
import { AssetCard } from './components/asset-card'

export const AssetsSection = () => {
  const { artistName } = useParams({ from: '/artists/$artistName/' })
  const loaderData = useLoaderData({ from: '/artists/$artistName/' })

  const { data: artists = [] } = useLiveQuery(query =>
    query.from({ artistItem: artistsCollection }).where(({ artistItem }) => eq(artistItem.artist.name, artistName)),
  )

  const assets = artists[0]?.assets || loaderData.assets

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Assets</h2>
        <Badge variant="secondary">{assets.length} assets</Badge>
      </div>

      {assets.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset: any) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No assets yet</h3>
          <p className="text-muted-foreground">This artist hasn't uploaded any assets yet.</p>
        </div>
      )}
    </section>
  )
}
