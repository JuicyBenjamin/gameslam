import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const SlamsHeader = () => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Game Slams</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Discover ongoing creative challenges and showcase your game development skills
        </p>
      </div>
      <Button asChild size="lg" className="w-fit">
        <Link to="/slams/create">
          <Plus className="mr-2 h-4 w-4" />
          Create your own Slam
        </Link>
      </Button>
    </div>
  )
}
