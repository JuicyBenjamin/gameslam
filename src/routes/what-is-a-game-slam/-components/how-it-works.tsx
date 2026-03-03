import { Palette, Users, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const HowItWorks = () => {
  return (
    <section className="mb-20">
      <Card className="overflow-hidden">
        <CardHeader className="bg-linear-to-r from-muted to-muted/80 text-center">
          <CardTitle className="text-3xl font-bold text-foreground sm:text-4xl">How It Works</CardTitle>
          <CardDescription className="mx-auto mt-4 max-w-3xl text-lg">
            When you join a Game Slam, you'll get a challenge and a set of game assets to work with. Here's why this
            approach is helpful:
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="flex flex-col items-center rounded-xl bg-primary/10 p-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Palette className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-primary">Skip the Art Part</h3>
              <p className="text-muted-foreground">
                We point you to the game assets, so you can focus on making the game feel fun to play.
              </p>
            </div>

            <div className="flex flex-col items-center rounded-xl bg-accent/10 p-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent-foreground">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-accent-foreground">Discover New Assets</h3>
              <p className="text-muted-foreground">
                Each slam features work from game artists, helping you find cool assets for your future projects.
              </p>
            </div>

            <div className="flex flex-col items-center rounded-xl bg-primary/5 p-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-primary">Know When You're Done</h3>
              <p className="text-muted-foreground">
                Each challenge has a simple list of requirements, so you know exactly what you need to build.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
