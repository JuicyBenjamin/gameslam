import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, Users, User, Package, ExternalLink, Plus, Share2, Copy, Trophy, Award, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Separator } from '@/components/ui/separator'
import { getCurrentUser } from '@/loaders/auth'
import { object, string, pipe, nonEmpty, url, custom, safeParse } from 'valibot'
import { toast } from 'sonner'
import { fetchSlamDetails } from '@/server-functions/slam-show'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { slamsCollection, slamEntriesCollection } from '@/collections'

// Validation schema for join slam form
const JoinSlamSchema = object({
  itchIoLink: pipe(
    string(),
    nonEmpty('Itch.io link is required'),
    url('Must be a valid URL'),
    custom(input => {
      if (typeof input !== 'string') return false
      return input.includes('itch.io')
    }, 'Must be an itch.io URL'),
  ),
})

type JoinSlamForm = typeof JoinSlamSchema.type

// Function to fetch itch.io data
async function getItchIoData(url: string) {
  const response = await fetch(`${url}/data.json`)
  if (!response.ok) {
    throw new Error('Failed to fetch itch.io data')
  }
  const data = await response.json()
  return {
    assetName: data.title,
    description: data.description,
  }
}

// Loader function
export const Route = createFileRoute('/slams/show/$id')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const [slam, user] = await Promise.all([
      fetchSlamDetails({ data: { slamId: params.id } }),
      getCurrentUser(),
    ])
    return { slam, user }
  },
})

// Mock function for date formatting
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function RouteComponent() {
  const { slam: initialSlam, user } = Route.useLoaderData()
  const { id: slamId } = Route.useParams()
  const navigate = Route.useNavigate()
  // const joinSlamMutation = useServerFn(joinSlamFn)

  // Get slam from collection
  const { data: slams = [] } = useLiveQuery(query =>
    query.from({ slamItem: slamsCollection }).where(({ slamItem }) => eq(slamItem.slam.id, slamId)),
  )
  const slamFromCollection = slams[0]

  // Get entries from collection filtered by slamId
  const { data: entries = [] } = useLiveQuery(query =>
    query
      .from({ entryItem: slamEntriesCollection })
      .where(({ entryItem }) => eq(entryItem.entry.slamId, slamId))
      .orderBy(({ entryItem }) => entryItem.entry.createdAt, 'desc'),
  )

  // Merge collection data with loader data
  // Use collection data for slam and entries (reactive), loader data for artist, asset, createdBy
  const slam = {
    ...initialSlam,
    slam: slamFromCollection?.slam || initialSlam.slam,
    entries:
      entries.length > 0
        ? entries.map(e => ({
            ...e.entry,
            user: e.user,
          }))
        : initialSlam.entries,
  }

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [itchIoLink, setItchIoLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isLoggedIn = user != null

  // Handle form submission
  const handleJoinSlam = async (e: React.FormEvent) => {
    e.preventDefault()
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
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to submit entry. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = async (platform: string) => {
    const url = window.location.href
    const text = `Check out this awesome Game Slam: ${slam.slam.name}`

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          '_blank',
        )
        break
      case 'bluesky':
        window.open(`https://bsky.app/intent/compose?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank')
        break
      case 'copy':
        try {
          await navigator.clipboard.writeText(url)
          toast.success('Link copied!', {
            description: 'The slam link has been copied to your clipboard.',
          })
        } catch (err) {
          toast.error('Failed to copy', {
            description: 'Please copy the link manually.',
          })
        }
        break
    }
  }

  // Filter out null entries
  const validEntries = slam.entries.filter((entry: any) => entry !== null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Button
            variant="ghost"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link to="/slams">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Slams
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">
            <Clock className="mr-1 h-3 w-3" />
            Active
          </Badge>
          <h1 className="mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            {slam.slam.name}
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {slam.slam.description}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="mb-12 grid gap-8 lg:grid-cols-3">
          {/* Left Column - Slam Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Entries</p>
                      <p className="text-lg font-semibold">{validEntries.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created by</p>
                      {slam.createdBy?.name && (
                        <Button variant="link" asChild className="p-0 h-auto text-lg font-semibold">
                          <Link to="/$userName" params={{ userName: slam.createdBy.name }}>{slam.createdBy.name}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Asset Info Card */}
            {slam.artist && slam.asset && (
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Featured Asset
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg" alt={slam.artist.name} />
                      <AvatarFallback>
                        {slam.artist.name
                          .split(' ')
                          .map((word: string) => word.charAt(0))
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Button variant="link" asChild className="p-0 h-auto text-lg font-semibold">
                          <Link to="/artists/$artistName" params={{ artistName: slam.artist.name }}>{slam.asset.name}</Link>
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">by {slam.artist.name}</p>
                      <p className="text-sm text-muted-foreground">Featured asset for this slam</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Entries Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Recent Entries
                  </span>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {validEntries.slice(0, 3).map((entry: any) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <div>
                        <p className="font-medium">{entry.name}</p>
                        <p className="text-sm text-muted-foreground">
                          by {entry.user?.name || 'Unknown User'}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={entry.linkToEntry} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Join Slam Card */}
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
                            onChange={e => setItchIoLink(e.target.value)}
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

            {/* View Asset Card */}
            {slam.asset && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Package className="mx-auto h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-4">View Asset</h3>
                  <p className="mb-6 text-muted-foreground">
                    Check out the asset that inspired this game slam challenge.
                  </p>
                  <Button variant="outline" size="lg" asChild className="w-full">
                    <a href={slam.asset.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Go to Asset
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Slam Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Slam Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Entries:</span>
                  <span className="font-medium">{validEntries.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">{formatDate(slam.slam.createdAt.toISOString())}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Prize:</span>
                  <span className="font-medium text-right max-w-[60%]">TBD</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Share Section */}
        <div className="text-center">
          <Separator className="mb-6" />
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Share this slam</h3>
            <p className="text-muted-foreground">Help spread the word about this awesome challenge!</p>
          </div>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => handleShare('twitter')} title="Share on X (Twitter)">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Button>

            <Button variant="outline" size="icon" onClick={() => handleShare('bluesky')} title="Share on BlueSky">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-2.67-.296-5.568.628-6.383 3.364C.378 17.703 0 22.661 0 23.349c0 .688.139 1.86.902 2.202.659.299 1.664.621 4.3-1.24 2.752-1.942 5.711-5.881 6.798-7.995 1.087 2.114 4.046 6.053 6.798 7.995 2.636 1.861 3.641 1.539 4.3 1.24.763-.342.902-1.514.902-2.202 0-.688-.378-5.646-.624-6.475-.815-2.736-3.713-3.66-6.383-3.364-.139.016-.277.034-.415.056.138-.017.276-.036.415-.056 2.67.296 5.568-.628 6.383-3.364.246-.829.624-5.789.624-6.479 0-.688-.139-1.86-.902-2.202-.659-.299-1.664-.621-4.3 1.24-2.752 1.942-5.711 5.881-6.798 7.995z" />
              </svg>
            </Button>

            <Button variant="outline" size="icon" onClick={() => handleShare('copy')} title="Copy link">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
