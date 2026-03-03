import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const InfoCta = () => {
  return (
    <section className="text-center">
      <Card className="overflow-hidden bg-linear-to-r from-purple-600 to-indigo-600">
        <CardContent className="p-8">
          <h3 className="mb-4 text-2xl font-bold text-white lg:text-3xl">
            Ready to Start Your Game Development Journey?
          </h3>
          <p className="mx-auto mb-6 max-w-md text-lg text-white/90">
            Join our community and participate in your first Game Slam today!
          </p>
          <Button asChild size="lg" className="bg-card text-primary hover:bg-muted">
            <Link to="/slams">Check Out Current Slams</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
