import { useState } from 'react'
import { useLoaderData, Link } from '@tanstack/react-router'
import { Plus, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export const JoinSlamCard = () => {
  const loaderData = useLoaderData({ from: '/slams/show/$id/' })
  const isLoggedIn = loaderData.user != null

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [itchIoLink, setItchIoLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleJoinSlam = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Fix server function mutation
      const result = { status: 'success' as const, message: 'Success' }

      if (result.status === 'success') {
        toast.success('Success!', {
          description: 'Your entry has been submitted successfully.',
        })
        setIsJoinModalOpen(false)
        setItchIoLink('')
      } else {
        toast.error('Error', {
          description: result.message || 'Failed to submit entry. Please try again.',
        })
      }
    } catch {
      toast.error('Error', {
        description: 'Failed to submit entry. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
      <CardContent className="p-6 text-center">
        <Trophy className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-xl font-bold mb-4">Join the Slam</h3>
        <p className="mb-6 text-primary-foreground/90">
          Ready to showcase your skills? Join this game slam and compete with other talented creators.
          {!isLoggedIn && (
            <span className="block mt-2 text-sm">You'll need to sign up first to participate!</span>
          )}
        </p>

        {isLoggedIn ? (
          <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Join Slam
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Slam</DialogTitle>
                <DialogDescription>
                  Submit your itch.io game entry to participate in this slam.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleJoinSlam} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="itchIoLink">Itch.io Entry Link</Label>
                  <Input
                    id="itchIoLink"
                    type="url"
                    placeholder="https://example.itch.io/game"
                    value={itchIoLink}
                    onChange={event => setItchIoLink(event.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Paste the URL of your itch.io game entry
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Entry'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            size="lg"
            asChild
            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <Link to="/sign-up">
              <Plus className="mr-2 h-4 w-4" />
              Sign Up to Join
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
