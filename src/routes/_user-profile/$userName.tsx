import { createFileRoute } from '@tanstack/react-router'
import {
  Shield,
  Plus,
  Trophy,
  Users,
  Calendar,
  ArrowUpRight,
  CheckCircle,
  ExternalLink,
  Star,
  Award,
  TrendingUp,
  Clock,
  Gamepad2,
  Heart,
  MessageCircle,
  BarChart3,
  Target,
  Zap,
  Crown,
  Medal,
  Flame,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { fetchUserProfile, getCurrentUser } from '~/server-functions/user-profile'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { usersCollection, slamsCollection, slamEntriesCollection } from '~/collections'

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
  component: UserProfile,
  loader: async ({ params }) => {
    // This runs on the server and provides data for SSR
    try {
      const [profileData, currentUser] = await Promise.all([
        fetchUserProfile({ data: { userName: params.userName } } as any),
        getCurrentUser(),
      ])
      console.log('User profile data:', profileData)
      console.log('Current user:', currentUser)
      return {
        ...profileData,
        currentUser: currentUser.user,
      }
    } catch (error) {
      console.error('User profile loader error:', error)
      throw error
    }
  },
})

function UserProfile() {
  const { userName } = Route.useParams()
  const loaderData = Route.useLoaderData()
  const { user: initialUser, slams: initialSlams, entries: initialEntries, currentUser } = loaderData

  // Get user from collection for reactive updates
  const { data: users = [] } = useLiveQuery(query =>
    query.from({ user: usersCollection }).where(({ user }) => eq(user.name, userName)),
  )
  const user = users[0] || initialUser

  // Use initialUser.id from loader to ensure queries run immediately (SSR data available)
  // This prevents blank page - queries can start immediately with loader data
  const userId = initialUser?.id || user?.id

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </div>
    )
  }

  // Get user's slams from collection - use loader data structure as fallback
  const { data: userSlams } = useLiveQuery(query =>
    query
      .from({ slamItem: slamsCollection })
      .where(({ slamItem }) => eq(slamItem.slam.createdBy, userId))
      .orderBy(({ slamItem }) => slamItem.slam.createdAt, 'desc'),
  )

  // Get user's entries from collection - use loader data structure as fallback
  const { data: userEntries } = useLiveQuery(query =>
    query
      .from({ entryItem: slamEntriesCollection })
      .where(({ entryItem }) => eq(entryItem.entry.userId, userId))
      .orderBy(({ entryItem }) => entryItem.entry.createdAt, 'desc'),
  )

  // Map collection data to match component expectations
  // Use collection data if available, otherwise use loader data (instant render)
  const slams =
    userSlams && userSlams.length > 0
      ? userSlams.map(slamItem => ({
          ...slamItem.slam,
          entryCount: slamItem.entryCount,
          status: slamItem.slam.isDeleted ? 'deleted' : 'active',
        }))
      : initialSlams.map(slam => ({
          ...slam,
          entryCount: 0,
          status: slam.isDeleted ? 'deleted' : 'active',
        }))

  const entries =
    userEntries && userEntries.length > 0
      ? userEntries.map(entryItem => ({
          ...entryItem.entry,
          slam: entryItem.slam ? { name: entryItem.slam.name } : null,
        }))
      : initialEntries

  // Calculate stats from collection data
  const stats = {
    totalSlams: slams.length,
    totalEntries: entries.length,
  }

  // Calculate additional stats
  const totalParticipations = entries.length
  const activeSlams = slams.filter((slam: any) => slam.status === 'active').length
  const completedSlams = slams.filter((slam: any) => slam.status === 'completed').length
  const averageEntriesPerSlam = slams.length > 0 ? Math.round((totalParticipations / slams.length) * 10) / 10 : 0

  // Mock achievements based on stats
  const achievements = [
    {
      id: 1,
      name: 'First Slam',
      description: 'Created your first slam',
      icon: Trophy,
      earned: slams.length > 0,
      rarity: 'common',
    },
    {
      id: 2,
      name: 'Active Creator',
      description: 'Created 5+ slams',
      icon: Crown,
      earned: slams.length >= 5,
      rarity: 'rare',
    },
    {
      id: 3,
      name: 'Slam Master',
      description: 'Created 10+ slams',
      icon: Medal,
      earned: slams.length >= 10,
      rarity: 'epic',
    },
    {
      id: 4,
      name: 'First Entry',
      description: 'Submitted your first entry',
      icon: Star,
      earned: entries.length > 0,
      rarity: 'common',
    },
    {
      id: 5,
      name: 'Active Participant',
      description: 'Submitted 10+ entries',
      icon: Flame,
      earned: entries.length >= 10,
      rarity: 'rare',
    },
    {
      id: 6,
      name: 'Slam Legend',
      description: 'Submitted 25+ entries',
      icon: Award,
      earned: entries.length >= 25,
      rarity: 'legendary',
    },
  ]

  const earnedAchievements = achievements.filter(achievement => achievement.earned)
  const totalAchievements = achievements.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-accent/10 dark:from-background dark:via-muted dark:to-accent/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10"></div>
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          ></div>
        </div>

        <div className="relative bg-card/80 backdrop-blur-sm shadow-lg">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left">
              {/* Enhanced Avatar with Status */}
              <div className="relative mb-6 lg:mb-0 lg:mr-8">
                <Avatar className="h-32 w-32 ring-4 ring-card shadow-xl">
                  <AvatarImage src={user.avatarLink || '/placeholder.svg'} alt={user.name} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                    {user.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                {/* Online Status Indicator */}
                <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-accent border-2 border-card flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-card"></div>
                </div>
              </div>

              {/* Enhanced User Info */}
              <div className="flex-1">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {user.name}
                    </h1>
                    {user.isVerified && (
                      <Badge variant="default">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <p className="text-xl text-muted-foreground mb-4">@{user.name}</p>

                  {/* Achievement Progress */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {earnedAchievements.length}/{totalAchievements} Achievements
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">Member since {new Date().getFullYear()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 lg:mt-0">
                <div className="text-center p-4 bg-card/60 rounded-xl backdrop-blur-sm border">
                  <div className="text-3xl font-bold text-foreground mb-1">{stats.totalSlams}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Gamepad2 className="h-4 w-4" />
                    Slams Created
                  </div>
                </div>
                <div className="text-center p-4 bg-card/60 rounded-xl backdrop-blur-sm border">
                  <div className="text-3xl font-bold text-foreground mb-1">{stats.totalEntries}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Target className="h-4 w-4" />
                    Entries
                  </div>
                </div>
                <div className="text-center p-4 bg-card/60 rounded-xl backdrop-blur-sm border">
                  <div className="text-3xl font-bold text-foreground mb-1">{activeSlams}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Zap className="h-4 w-4" />
                    Active Slams
                  </div>
                </div>
                <div className="text-center p-4 bg-card/60 rounded-xl backdrop-blur-sm border">
                  <div className="text-3xl font-bold text-foreground mb-1">{earnedAchievements.length}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Award className="h-4 w-4" />
                    Achievements
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Achievements Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              Achievements
            </h2>
            <Badge variant="secondary">
              {earnedAchievements.length}/{totalAchievements} earned
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(achievement => {
              const IconComponent = achievement.icon
              const isEarned = achievement.earned
              const rarityColors = {
                common: 'border-border bg-muted',
                rare: 'border-primary/30 bg-primary/10',
                epic: 'border-primary/50 bg-primary/20',
                legendary: 'border-primary bg-primary/30',
              }

              return (
                <Card
                  key={achievement.id}
                  className={`transition-all duration-300 hover:shadow-lg ${
                    isEarned
                      ? `border-2 ${rarityColors[achievement.rarity as keyof typeof rarityColors]} shadow-md`
                      : 'border-border bg-muted/50 opacity-60'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isEarned
                            ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${isEarned ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-sm ${isEarned ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                          {achievement.description}
                        </p>
                      </div>
                      {isEarned && <CheckCircle className="h-5 w-5 text-accent" />}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Enhanced Stats Overview */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              Performance Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary">Success Rate</p>
                    <p className="text-2xl font-bold text-foreground">
                      {slams.length > 0 ? Math.round((completedSlams / slams.length) * 100) : 0}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/10 to-accent/20 border-accent/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-accent-foreground">Avg. Entries/Slam</p>
                    <p className="text-2xl font-bold text-foreground">{averageEntriesPerSlam}</p>
                  </div>
                  <Target className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-primary/15 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary">Active Slams</p>
                    <p className="text-2xl font-bold text-foreground">{activeSlams}</p>
                  </div>
                  <Zap className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/5 to-accent/15 border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-accent-foreground">Total Activity</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalSlams + stats.totalEntries}</p>
                  </div>
                  <Heart className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Slams Created Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Gamepad2 className="h-6 w-6 text-primary" />
              Created Slams
            </h2>
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
                          <span className="text-muted-foreground">Created</span>
                          <span className="font-medium">{formatDate(slam.createdAt)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Status</span>
                          <Badge variant={slam.status === 'active' ? 'default' : 'secondary'}>{slam.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Participants</span>
                          <span className="font-medium">{slam.entryCount} entries</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardContent className="pt-0">
                      <Button asChild size="sm" variant="outline" className="w-full">
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
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No slams created yet</h3>
              <p className="text-muted-foreground mb-6">This user hasn't created any slams yet.</p>
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
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Target className="h-6 w-6 text-accent" />
              Slam Entries
            </h2>
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
                        <span className="text-muted-foreground">Submitted</span>
                        <span className="font-medium">{formatDate(entry.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Slam</span>
                        <span className="font-medium">{entry.slam?.name || 'Unknown Slam'}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent className="pt-0">
                    <Button asChild size="sm" variant="outline" className="w-full">
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
              <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No entries yet</h3>
              <p className="text-muted-foreground mb-6">This user hasn't submitted any slam entries yet.</p>
              <Button asChild>
                <Link to="/slams">
                  <Users className="mr-2 h-4 w-4" />
                  Explore Slams
                </Link>
              </Button>
            </div>
          )}
        </section>

        {/* Activity Timeline */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              Recent Activity
            </h2>
          </div>

          <Card className="bg-gradient-to-br from-muted to-muted/80">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Mock recent activities - in a real app, this would come from the database */}
                {[
                  {
                    type: 'slam_created',
                    title: 'Created "48-Hour Game Jam"',
                    time: '2 hours ago',
                    icon: Gamepad2,
                    color: 'text-primary',
                  },
                  {
                    type: 'entry_submitted',
                    title: 'Submitted entry to "Pixel Art Challenge"',
                    time: '1 day ago',
                    icon: Target,
                    color: 'text-accent',
                  },
                  {
                    type: 'achievement_earned',
                    title: 'Earned "Active Creator" achievement',
                    time: '3 days ago',
                    icon: Trophy,
                    color: 'text-primary',
                  },
                  {
                    type: 'slam_completed',
                    title: 'Completed "Music Game Slam"',
                    time: '1 week ago',
                    icon: CheckCircle,
                    color: 'text-accent',
                  },
                ].map((activity, index) => {
                  const IconComponent = activity.icon
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-colors"
                    >
                      <div className="p-2 rounded-full bg-card shadow-sm">
                        <IconComponent className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
