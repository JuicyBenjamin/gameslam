import { Target, Users, Package, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const JoinCommunity = () => {
  return (
    <section className="mb-20">
      <Card className="overflow-hidden bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-foreground sm:text-4xl">Join the Community</CardTitle>
          <CardDescription className="mx-auto mt-4 max-w-2xl text-lg">
            Game Slam is a place where you can:
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start space-x-4 rounded-lg bg-white/60 p-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-foreground">Try New Challenges</h3>
                <p className="text-muted-foreground">Try out new game development challenges</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 rounded-lg bg-white/60 p-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent-foreground">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-foreground">Meet Developers</h3>
                <p className="text-muted-foreground">Meet other game developers</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 rounded-lg bg-white/60 p-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-foreground">Find Assets</h3>
                <p className="text-muted-foreground">Find game assets for your projects</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 rounded-lg bg-white/60 p-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-foreground">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-foreground">Share Progress</h3>
                <p className="text-muted-foreground">Share what you're working on</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
