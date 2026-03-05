import { ArrowUpRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format-date'

interface ISlamCardProps {
  slam: any
}

export const SlamCard = ({ slam }: ISlamCardProps) => {
  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="line-clamp-2">{slam.name}</CardTitle>
        <CardDescription className="line-clamp-2">{slam.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Created</span>
            <span className="font-medium">{formatDate(slam.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={slam.status === 'active' ? 'default' : 'secondary'}>{slam.status}</Badge>
          </div>
        </div>
      </CardContent>
      <CardContent className="pt-0">
        <ButtonLink to="/slams/show/$id" params={{ id: slam.id }} size="sm" variant="outline" className="w-full">
          <ArrowUpRight className="mr-2 h-4 w-4" />
          View Slam
        </ButtonLink>
      </CardContent>
    </Card>
  )
}
