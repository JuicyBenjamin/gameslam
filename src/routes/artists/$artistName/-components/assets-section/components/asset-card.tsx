import { ExternalLink, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface IAssetCardProps {
  asset: any
}

export const AssetCard = ({ asset }: IAssetCardProps) => {
  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="line-clamp-2">{asset.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {asset.itchData?.description || asset.description || 'No description available'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Price</span>
            <span className="font-medium">{asset.itchData?.price || 'Free'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Downloads</span>
            <span className="font-medium">{asset.itchData?.downloads || 0}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Rating</span>
            <div className="flex items-center">
              <span className="font-medium">{asset.itchData?.rating || 0}</span>
              <span className="ml-1 text-yellow-500">★</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardContent className="pt-0">
        <Button asChild size="sm" variant="outline" className="w-full">
          <a href={asset.link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Asset
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
