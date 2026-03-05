import { Button } from '@/components/ui/button'
import { ButtonLink } from '@/components/ui/button-link'

export function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <div className="space-y-2 p-2">
      <div className="text-muted-foreground">
        {children || <p>The page you are looking for does not exist.</p>}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Button size="sm" onClick={() => window.history.back()}>
          Go back
        </Button>
        <ButtonLink to="/" size="sm" variant="secondary">
          Start Over
        </ButtonLink>
      </div>
    </div>
  )
}
