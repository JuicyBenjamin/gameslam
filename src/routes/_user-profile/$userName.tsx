import { createFileRoute } from '@tanstack/react-router'
import { Shield, Plus, Trophy, Users, Calendar, ArrowUpRight, CheckCircle } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { db, logQuery, printQueryStats } from '~/db/logger'
import { users } from '~/db/schema/users'
import { slams } from '~/db/schema/slams'
import { slamEntries } from '~/db/schema/slamEntries'
import { eq, sql } from 'drizzle-orm'
import { getUserByName } from '~/db/queries/users'

// Mock function for date formatting
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Function to get slam rarity badge
function getSlamRarity(participantCount: number) {
  if (participantCount === 0) return { label: 'New', variant: 'secondary' as const }
  if (participantCount <= 10) return { label: 'Growing', variant: 'default' as const }
  if (participantCount <= 20) return { label: 'Popular', variant: 'default' as const }
  return { label: 'Hot', variant: 'destructive' as const }
}

export const Route = createFileRoute('/_user-profile/$userName')({
  component: UserProfile,
  loader: async ({ params }) => {
    // This runs on the server and provides data for SSR
    try {
      const userName = params.userName
      console.log('Fetching user profile on server for:', userName)

      // Get user by name
      const user = await getUserByName(userName)

      if (!user) {
        throw new Error('User not found')
      }

      // Get slams created by the user with participant counts
      const createdSlams = await logQuery('getUserCreatedSlams', async () => {
        return await db
          .select({
            slam: slams,
            participantCount: sql<number>`cast(count(${slamEntries.id}) as int)`,
          })
          .from(slams)
          .leftJoin(slamEntries, eq(slamEntries.slamId, slams.id))
          .where(eq(slams.createdBy, user.id))
          .groupBy(slams.id)
          .orderBy(slams.createdAt)
      })

      // Get slams the user is participating in
      const participatingSlams = await logQuery('getUserParticipatingSlams', async () => {
        return await db
          .select({
            slam: slams,
            entry: slamEntries,
          })
          .from(slamEntries)
          .innerJoin(slams, eq(slamEntries.slamId, slams.id))
          .where(eq(slamEntries.userId, user.id))
          .orderBy(slamEntries.createdAt)
      })

      const userProfile = {
        user: {
          ...user,
          bio: 'Game jam enthusiast and organizer. Love creating challenging themes that push creative boundaries. Always excited to see what the community builds!',
          joinedDate: '2023-01-15', // Using fallback since createdAt doesn't exist on user schema
          location: 'San Francisco, CA',
        },
        createdSlams: createdSlams.map(s => ({
          ...s.slam,
          participantCount: s.participantCount,
          status:
            s.slam.createdAt && new Date(s.slam.createdAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ? 'completed'
              : 'active',
        })),
        participatingSlams: participatingSlams.map(s => ({
          ...s.slam,
          entryId: s.entry.id,
          submissionDate: s.entry.createdAt,
          status: 'submitted',
        })),
      }

      // Print statistics at the end of this request
      printQueryStats()

      console.log('User profile loader data:', userProfile)
      return { userProfile }
    } catch (error) {
      console.error('User profile loader error:', error)
      throw error
    }
  },
})

export default function UserProfile() {
  const { userProfile } = Route.useLoaderData()

  // Debug logging to see what we're working with
  console.log('User profile data:', userProfile)
  console.log('Avatar link:', userProfile.user.avatarLink)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="relative">
              <Avatar className="h-32 w-32 ring-4 ring-primary-foreground/20 ring-offset-4 ring-offset-primary">
                <img
                  src={userProfile.user.avatarLink}
                  alt={`${userProfile.user.name}'s avatar`}
                  className="aspect-square size-full object-cover rounded-full"
                  onError={e => {
                    console.error('Image failed to load:', userProfile.user.avatarLink)
                    console.error('Error event:', e)
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', userProfile.user.avatarLink)
                  }}
                />
                <AvatarFallback className="text-2xl bg-primary-foreground/20">
                  {userProfile.user.name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="mb-4">
                <h1 className="mb-2 text-4xl font-bold md:text-5xl flex items-center justify-center md:justify-start gap-3">
                  {userProfile.user.name}
                  {userProfile.user.isVerified && <CheckCircle className="h-8 w-8 text-primary-foreground" />}
                </h1>
                <p className="text-lg text-primary-foreground/90 max-w-2xl mb-4">{userProfile.user.bio}</p>
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-primary-foreground/80">
                  <span>📍 {userProfile.user.location}</span>
                  <span>📅 Joined {formatDate(userProfile.user.joinedDate)}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Card className="bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Shield className="h-6 w-6" />
                      <span className="text-2xl font-bold">{userProfile.createdSlams.length}</span>
                    </div>
                    <p className="text-sm text-primary-foreground/80">Created Slams</p>
                  </CardContent>
                </Card>

                <Card className="bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="h-6 w-6" />
                      <span className="text-2xl font-bold">{userProfile.participatingSlams.length}</span>
                    </div>
                    <p className="text-sm text-primary-foreground/80">Participating Slams</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Created Slams */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Created Slams</h2>
            </div>

            {userProfile.createdSlams.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Plus className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">No slams created yet</p>
                  <Button asChild>
                    <Link to="/slams/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create your first slam
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userProfile.createdSlams.map((slam: any) => {
                  const rarity = getSlamRarity(slam.participantCount)
                  return (
                    <Card key={`created-${slam.id}`} className="group hover:shadow-lg transition-all duration-300">
                      <Link to={`/slams/show/${slam.id}`} className="block">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center justify-between">
                            <span>{slam.name}</span>
                            <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </CardTitle>
                          <CardDescription className="line-clamp-2">{slam.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>
                                  {slam.participantCount} {slam.participantCount === 1 ? 'participant' : 'participants'}
                                </span>
                              </div>
                              {slam.createdAt && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(slam.createdAt)}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={rarity.variant}>{rarity.label}</Badge>
                              <Badge variant={slam.status === 'active' ? 'default' : 'secondary'}>
                                {slam.status === 'active' ? 'Active' : 'Completed'}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* Participating Slams */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Participating Slams</h2>
            </div>

            {userProfile.participatingSlams.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Trophy className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Not participating in any slams yet</p>
                  <Button asChild variant="outline">
                    <Link to="/slams">
                      <Trophy className="mr-2 h-4 w-4" />
                      Browse slams
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userProfile.participatingSlams.map((slam: any) => (
                  <Card
                    key={`participating-${slam.entryId}`}
                    className="group hover:shadow-lg transition-all duration-300"
                  >
                    <Link to={`/slams/show/${slam.id}`} className="block">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center justify-between">
                          <span>{slam.name}</span>
                          <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardTitle>
                        <CardDescription className="line-clamp-2">{slam.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Joined {formatDate(slam.createdAt)}</span>
                            </div>
                            {slam.submissionDate && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                <span>Submitted {formatDate(slam.submissionDate)}</span>
                              </div>
                            )}
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Submitted
                          </Badge>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
