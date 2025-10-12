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
  const { user, slams, entries, stats, currentUser } = Route.useLoaderData()

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          ></div>
        </div>

        <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left">
              {/* Enhanced Avatar with Status */}
              <div className="relative mb-6 lg:mb-0 lg:mr-8">
                <Avatar className="h-32 w-32 ring-4 ring-white dark:ring-slate-700 shadow-xl">
                  <AvatarImage src={user.avatarLink || '/placeholder.svg'} alt={user.name} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {user.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                {/* Online Status Indicator */}
                <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-green-500 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
              </div>

              {/* Enhanced User Info */}
              <div className="flex-1">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                      {user.name}
                    </h1>
                    {user.isVerified && (
                      <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 text-white">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">@{user.name}</p>

                  {/* Achievement Progress */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {earnedAchievements.length}/{totalAchievements} Achievements
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Member since {new Date().getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 lg:mt-0">
                <div className="text-center p-4 bg-white/60 dark:bg-slate-700/60 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-600/20">
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stats.totalSlams}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1">
                    <Gamepad2 className="h-4 w-4" />
                    Slams Created
                  </div>
                </div>
                <div className="text-center p-4 bg-white/60 dark:bg-slate-700/60 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-600/20">
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stats.totalEntries}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1">
                    <Target className="h-4 w-4" />
                    Entries
                  </div>
                </div>
                <div className="text-center p-4 bg-white/60 dark:bg-slate-700/60 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-600/20">
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{activeSlams}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1">
                    <Zap className="h-4 w-4" />
                    Active Slams
                  </div>
                </div>
                <div className="text-center p-4 bg-white/60 dark:bg-slate-700/60 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-600/20">
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {earnedAchievements.length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1">
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Achievements
            </h2>
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
            >
              {earnedAchievements.length}/{totalAchievements} earned
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(achievement => {
              const IconComponent = achievement.icon
              const isEarned = achievement.earned
              const rarityColors = {
                common: 'border-gray-300 bg-gray-50 dark:bg-gray-800/50',
                rare: 'border-blue-300 bg-blue-50 dark:bg-blue-900/20',
                epic: 'border-purple-300 bg-purple-50 dark:bg-purple-900/20',
                legendary: 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20',
              }

              return (
                <Card
                  key={achievement.id}
                  className={`transition-all duration-300 hover:shadow-lg ${
                    isEarned
                      ? `border-2 ${rarityColors[achievement.rarity as keyof typeof rarityColors]} shadow-md`
                      : 'border-gray-200 bg-gray-50/50 dark:bg-slate-800/50 opacity-60'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isEarned
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            isEarned ? 'text-slate-900 dark:text-slate-100' : 'text-gray-500'
                          }`}
                        >
                          {achievement.name}
                        </h3>
                        <p className={`text-sm ${isEarned ? 'text-slate-600 dark:text-slate-400' : 'text-gray-400'}`}>
                          {achievement.description}
                        </p>
                      </div>
                      {isEarned && <CheckCircle className="h-5 w-5 text-green-500" />}
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-500" />
              Performance Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Success Rate</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {slams.length > 0 ? Math.round((completedSlams / slams.length) * 100) : 0}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Avg. Entries/Slam</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">{averageEntriesPerSlam}</p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Active Slams</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{activeSlams}</p>
                  </div>
                  <Zap className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Total Activity</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {stats.totalSlams + stats.totalEntries}
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Slams Created Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Gamepad2 className="h-6 w-6 text-blue-500" />
              Created Slams
            </h2>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              {slams.length} slams
            </Badge>
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
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Target className="h-6 w-6 text-green-500" />
              Slam Entries
            </h2>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
              {entries.length} entries
            </Badge>
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

        {/* Activity Timeline */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="h-6 w-6 text-purple-500" />
              Recent Activity
            </h2>
          </div>

          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Mock recent activities - in a real app, this would come from the database */}
                {[
                  {
                    type: 'slam_created',
                    title: 'Created "48-Hour Game Jam"',
                    time: '2 hours ago',
                    icon: Gamepad2,
                    color: 'text-blue-500',
                  },
                  {
                    type: 'entry_submitted',
                    title: 'Submitted entry to "Pixel Art Challenge"',
                    time: '1 day ago',
                    icon: Target,
                    color: 'text-green-500',
                  },
                  {
                    type: 'achievement_earned',
                    title: 'Earned "Active Creator" achievement',
                    time: '3 days ago',
                    icon: Trophy,
                    color: 'text-yellow-500',
                  },
                  {
                    type: 'slam_completed',
                    title: 'Completed "Music Game Slam"',
                    time: '1 week ago',
                    icon: CheckCircle,
                    color: 'text-purple-500',
                  },
                ].map((activity, index) => {
                  const IconComponent = activity.icon
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg bg-white/50 dark:bg-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-colors"
                    >
                      <div className={`p-2 rounded-full bg-white dark:bg-slate-600 shadow-sm`}>
                        <IconComponent className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{activity.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{activity.time}</p>
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
