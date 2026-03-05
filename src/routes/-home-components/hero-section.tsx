import { useLoaderData } from '@tanstack/react-router'
import { Gamepad2, Trophy, Users } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'

export const HeroSection = () => {
  const { user } = useLoaderData({ from: '/' })
  const isLoggedIn = user != null

  return (
    <section className="relative bg-linear-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Gamepad2 className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Welcome to <span className="text-primary">GameSlam</span>
          </h1>

          {!isLoggedIn ? (
            <>
              <p className="mb-8 text-xl text-muted-foreground leading-relaxed">
                Where game developers come together to create, compete, and celebrate the art of game development.
                Join our vibrant community of creators and bring your game ideas to life!
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <ButtonLink to="/slams" size="lg" className="text-lg">
                  <Trophy className="mr-2 h-5 w-5" />
                  Explore Slams
                </ButtonLink>
                <ButtonLink to="/sign-up" variant="outline" size="lg" className="text-lg bg-transparent">
                  <Users className="mr-2 h-5 w-5" />
                  Join Now
                </ButtonLink>
              </div>
            </>
          ) : (
            <>
              <p className="mb-8 text-xl text-muted-foreground leading-relaxed">
                Welcome back! Ready to create something amazing today?
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <ButtonLink to="/slams" size="lg" className="text-lg">
                  <Trophy className="mr-2 h-5 w-5" />
                  View Slams
                </ButtonLink>
                <ButtonLink to="/slams/create" variant="outline" size="lg" className="text-lg bg-transparent">
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Create Slam
                </ButtonLink>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
