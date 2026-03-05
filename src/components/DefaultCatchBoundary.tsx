import * as React from 'react'
import {
  ErrorComponent,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ButtonLink } from '@/components/ui/button-link'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error(error)

  return (
    <div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
      <ErrorComponent error={error} />
      <div className="flex gap-2 items-center flex-wrap">
        <Button size="sm" onClick={() => { router.invalidate() }}>
          Try Again
        </Button>
        {isRoot ? (
          <ButtonLink to="/" size="sm" variant="secondary">Home</ButtonLink>
        ) : (
          <Button size="sm" variant="secondary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        )}
      </div>
    </div>
  )
}
