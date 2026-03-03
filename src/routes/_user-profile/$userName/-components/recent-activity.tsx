import { Clock, Gamepad2, Target, Trophy, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const MOCK_ACTIVITIES = [
  {
    type: 'slam_created',
    title: 'Created "48-Hour Game Jam"',
    time: '2 hours ago',
    icon: Gamepad2,
    color: 'text-primary',
  },
  {
    type: 'entry_submitted',
    title: 'Submitted entry to "Pixel Art Challenge"',
    time: '1 day ago',
    icon: Target,
    color: 'text-accent',
  },
  {
    type: 'achievement_earned',
    title: 'Earned "Active Creator" achievement',
    time: '3 days ago',
    icon: Trophy,
    color: 'text-primary',
  },
  {
    type: 'slam_completed',
    title: 'Completed "Music Game Slam"',
    time: '1 week ago',
    icon: CheckCircle,
    color: 'text-accent',
  },
]

export const RecentActivity = () => {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          Recent Activity
        </h2>
      </div>

      <Card className="bg-gradient-to-br from-muted to-muted/80">
        <CardContent className="p-6">
          <div className="space-y-4">
            {MOCK_ACTIVITIES.map((activity, index) => {
              const IconComponent = activity.icon
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-colors"
                >
                  <div className="p-2 rounded-full bg-card shadow-sm">
                    <IconComponent className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
