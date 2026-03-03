import { UserAvatar } from './components/user-avatar'
import { UserInfo } from './components/user-info'
import { StatsGrid } from './components/stats-grid'

export const ProfileHero = () => {
  return (
    <div className="relative overflow-hidden">
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
            <UserAvatar />
            <UserInfo />
            <StatsGrid />
          </div>
        </div>
      </div>
    </div>
  )
}
