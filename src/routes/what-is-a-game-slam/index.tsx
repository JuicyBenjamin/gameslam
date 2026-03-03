import { createFileRoute } from '@tanstack/react-router'
import { InfoHero } from './-components/info-hero'
import { WhatMakesDifferent } from './-components/what-makes-different'
import { HowItWorks } from './-components/how-it-works'
import { JoinCommunity } from './-components/join-community'
import { InfoCta } from './-components/info-cta'

const WhatIsAGameSlamPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <InfoHero />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <WhatMakesDifferent />
        <HowItWorks />
        <JoinCommunity />
        <InfoCta />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/what-is-a-game-slam/')({
  component: WhatIsAGameSlamPage,
})
