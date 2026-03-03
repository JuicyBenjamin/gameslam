import { Clock, Target, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const WhatMakesDifferent = () => {
  return (
    <section className="mb-20">
      <div className="text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          What Makes Game Slams Different?
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
          Discover why Game Slams offer a unique approach to learning game development
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
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
  )
}
