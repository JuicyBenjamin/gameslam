import type { LucideIcon } from 'lucide-react'
import { CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type TAchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'

interface IAchievementCardProps {
  name: string
  description: string
  icon: LucideIcon
  earned: boolean
  rarity: TAchievementRarity
}

const RARITY_COLORS: Record<TAchievementRarity, string> = {
  common: 'border-border bg-muted',
  rare: 'border-primary/30 bg-primary/10',
  epic: 'border-primary/50 bg-primary/20',
  legendary: 'border-primary bg-primary/30',
}

export const AchievementCard = ({ name, description, icon: Icon, earned, rarity }: IAchievementCardProps) => {
  return (
    <Card
      className={`transition-all duration-300 hover:shadow-lg ${
        earned
          ? `border-2 ${RARITY_COLORS[rarity]} shadow-md`
          : 'border-border bg-muted/50 opacity-60'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              earned
                ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold ${earned ? 'text-foreground' : 'text-muted-foreground'}`}>
              {name}
            </h3>
            <p className={`text-sm ${earned ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
              {description}
            </p>
          </div>
          {earned && <CheckCircle className="h-5 w-5 text-accent" />}
        </div>
      </CardContent>
    </Card>
  )
}
