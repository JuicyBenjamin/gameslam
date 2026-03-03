import { QueryClient } from '@tanstack/react-query'

/**
 * Shared QueryClient instance.
 *
 * ES modules are singletons - this module code executes once,
 * and all imports reference the same instance. This ensures
 * all collections and the QueryClientProvider use the same client.
 *
 * For SSR: This is safe because QueryClientProvider only renders
 * on the client side, and collections are used client-side only.
 */
export const queryClient = new QueryClient()
