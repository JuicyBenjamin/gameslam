import { supabaseBrowser as supabase } from '~/lib/supabase.client'

export const logout = async () => {
  // Sign out and clear session
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error)
    throw error
  }

  // Refresh the page to update authentication state
  window.location.href = '/'
}
