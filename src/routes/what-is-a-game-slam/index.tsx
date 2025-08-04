import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Clock, Target, CheckCircle, Palette, Users, Package, MessageSquare } from 'lucide-react'

export const Route = createFileRoute('/what-is-a-game-slam/')({
  component: WhatIsAGameSlam,
})

function WhatIsAGameSlam() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              What is a Game Slam?
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/90 lg:text-2xl">
              A Game Slam is a fun way to practice game development, inspired by game jams but with a more relaxed
              approach. Instead of rushing to create a complete game, you'll focus on building specific game mechanics
              and learning as you go.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* What Makes Game Slams Different */}
        <section className="mb-20">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What Makes Game Slams Different?
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600">
              Discover why Game Slams offer a unique approach to learning game development
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Clock className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Learn at Your Own Pace</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Take time to understand and implement game mechanics without the pressure of a strict deadline.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Target className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Focus on What Matters</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Concentrate on making your game mechanics feel good, rather than trying to build everything at once.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Clear Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Each slam comes with a simple checklist of what you need to do to complete it.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-20">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</CardTitle>
              <CardDescription className="mx-auto mt-4 max-w-3xl text-lg">
                When you join a Game Slam, you'll get a challenge and a set of game assets to work with. Here's why this
                approach is helpful:
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="flex flex-col items-center rounded-xl bg-purple-50 p-6 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <Palette className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-purple-900">Skip the Art Part</h3>
                  <p className="text-gray-600">
                    We point you to the game assets, so you can focus on making the game feel fun to play.
                  </p>
                </div>

                <div className="flex flex-col items-center rounded-xl bg-blue-50 p-6 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-blue-900">Discover New Assets</h3>
                  <p className="text-gray-600">
                    Each slam features work from game artists, helping you find cool assets for your future projects.
                  </p>
                </div>

                <div className="flex flex-col items-center rounded-xl bg-green-50 p-6 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-green-900">Know When You're Done</h3>
                  <p className="text-gray-600">
                    Each challenge has a simple list of requirements, so you know exactly what you need to build.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Join the Community */}
        <section className="mb-20">
          <Card className="overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 sm:text-4xl">Join the Community</CardTitle>
              <CardDescription className="mx-auto mt-4 max-w-2xl text-lg">
                Game Slam is a place where you can:
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-start space-x-4 rounded-lg bg-white/60 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">Try New Challenges</h3>
                    <p className="text-gray-600">Try out new game development challenges</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 rounded-lg bg-white/60 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">Meet Developers</h3>
                    <p className="text-gray-600">Meet other game developers</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 rounded-lg bg-white/60 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">Find Assets</h3>
                    <p className="text-gray-600">Find game assets for your projects</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 rounded-lg bg-white/60 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">Share Progress</h3>
                    <p className="text-gray-600">Share what you're working on</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600">
            <CardContent className="p-8">
              <h3 className="mb-4 text-2xl font-bold text-white lg:text-3xl">
                Ready to Start Your Game Development Journey?
              </h3>
              <p className="mx-auto mb-6 max-w-md text-lg text-white/90">
                Join our community and participate in your first Game Slam today!
              </p>

              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Link to="/slams">Check Out Current Slams</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
