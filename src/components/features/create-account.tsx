import { ButtonLink } from '@/components/ui/button-link'

export const CreateAccount = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-bold">Thank you for joining GameSlam</h1>
      <p className="text-muted-foreground">Set up your profile to get started.</p>
      <ButtonLink to="/welcome">Set Up Profile</ButtonLink>
    </div>
  )
}
