import { createFileRoute } from '@tanstack/react-router'
import { Shield, Plus, Trophy, Users, Calendar, ArrowUpRight, CheckCircle, ExternalLink } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { fetchUserProfile } from '~/server-functions/user-profile'

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
  if (participantCount < 5) return { label: 'Rare', variant: 'default' as const }
  if (participantCount < 10) return { label: 'Common', variant: 'outline' as const }
  return { label: 'Popular', variant: 'destructive' as const }
}

export const Route = createFileRoute('/_user-profile/$userName')({
  beforeLoad: ({ params }) => {
    const userName = params.userName
    console.log('✅ Valid username for profile lookup:', userName)
  },
  loader: async ({ params }) => {
    // This runs on the server and provides data for SSR
    try {
      const profileData = await fetchUserProfile({ data: { userName: params.userName } } as any)
      console.log('User profile data:', profileData)
      return profileData
    } catch (error) {
      console.error('User profile loader error:', error)
      throw error
    }
  },
})

function UserProfile() {
  const { user, slams, entries, stats } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left">
            {/* Avatar */}
            <Avatar className="mb-4 h-24 w-24 md:mb-0 md:mr-6">
              <AvatarImage src={user.avatarLink || '/placeholder.svg'} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{user.name}</h1>
              <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">@{user.name}</p>
              <div className="mt-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {user.isVerified ? 'Verified User' : 'User'}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 md:mt-0 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalSlams}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Slams Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalEntries}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Entries</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Slams Created Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Created Slams</h2>
            <Badge variant="secondary">{slams.length} slams</Badge>
          </div>

          {slams.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {slams.map((slam: any) => {
                const rarity = getSlamRarity(slam.entryCount)
                return (
                  <Card key={slam.id} className="group h-full transition-all duration-300 hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="line-clamp-2">{slam.name}</CardTitle>
                          <CardDescription className="line-clamp-2">{slam.description}</CardDescription>
                        </div>
                        <Badge variant={rarity.variant} className="ml-2">
                          {rarity.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Created</span>
                          <span className="font-medium">{formatDate(slam.createdAt)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Status</span>
                          <Badge variant={slam.status === 'active' ? 'default' : 'secondary'}>{slam.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Participants</span>
                          <span className="font-medium">{slam.entryCount} entries</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardContent className="pt-0">
                      <Button asChild size="sm" className="w-full">
                        <Link to="/slams/show/$id" params={{ id: slam.id }}>
                          <ArrowUpRight className="mr-2 h-4 w-4" />
                          View Slam
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No slams created yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">This user hasn't created any slams yet.</p>
              <Button asChild>
                <Link to="/slams/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Slam
                </Link>
              </Button>
            </div>
          )}
        </section>

        {/* Slam Entries Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Slam Entries</h2>
            <Badge variant="secondary">{entries.length} entries</Badge>
          </div>

          {entries.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {entries.map((entry: any) => (
                <Card key={entry.id} className="group h-full transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{entry.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {entry.description || 'No description provided'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Submitted</span>
                        <span className="font-medium">{formatDate(entry.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Slam</span>
                        <span className="font-medium">{entry.slam?.name || 'Unknown Slam'}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent className="pt-0">
                    <Button asChild size="sm" className="w-full">
                      <a href={entry.linkToEntry} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Entry
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No entries yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                This user hasn't submitted any slam entries yet.
              </p>
              <Button asChild>
                <Link to="/slams">
                  <Users className="mr-2 h-4 w-4" />
                  Explore Slams
                </Link>
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
