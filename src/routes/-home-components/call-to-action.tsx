import { useLoaderData, Link } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const CallToAction = () => {
  const { user } = useLoaderData({ from: '/' })
  const isLoggedIn = user != null

  if (isLoggedIn) return null

  return (
    <section className="bg-linear-to-r from-primary to-primary/80 py-20 lg:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-6 text-3xl font-bold text-primary-foreground lg:text-4xl">
          Ready to Start Your Game Development Journey?
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-lg text-primary-foreground/90 lg:text-xl">
          Join GameSlam today and be part of a community that celebrates creativity and innovation in game
          development.
        </p>
        <Button asChild size="lg" variant="secondary" className="text-lg">
          <Link to="/sign-up">
            <Users className="mr-2 h-5 w-5" />
            Create Your Account
          </Link>
        </Button>
      </div>
    </section>
  )
}
