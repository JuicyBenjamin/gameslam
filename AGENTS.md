# GameSlam — Project Conventions

## Imports

- Use `@/` alias for all imports outside the current directory.
- Relative imports (`./`) only for files in the same directory.
- Use `import type` for type-only imports.
- Collections are barrel-exported from `@/collections`.

```tsx
// Good
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/server-functions/auth'
import type { TUser } from '@/db/schema/users'
import { slamsCollection } from '@/collections'

// Bad — don't use ~/ or relative paths across directories
import { Button } from '~/components/ui/button'
import { getCurrentUser } from '../../server-functions/auth'
```

## Destructuring Over Dot Notation

Destructure return values from hooks. Don't assign the whole object and use dot notation.

```tsx
// Good
const { mutate, isPending } = useMutation({ ... })
const { data, isLoading } = useQuery({ ... })
const { user, slams } = Route.useLoaderData()
mutate(values)

// Bad
const mutation = useMutation({ ... })
mutation.mutate(values)
```

Exception: when the full object reference is required, such as passing `form` to `form.Field` in TanStack Form.

## Interfaces & Types

- **Interfaces** describe object shapes. Prefix with `I`.
- **Types** describe values (unions, aliases, inferred types). Prefix with `T`.

```tsx
// Good
interface IUser {
  name: string
  age: number
  status: TStatus
}
type TStatus = 'single' | 'married' | 'divorced'

// Inferred DB types
type TUser = typeof users.$inferSelect

// Component props
interface IHeaderProps {
  initialUser: TUser | null
}
```

Skip the prefix for auto-generated types (e.g. `routeTree.gen.ts`).

## Components

- Arrow functions with named exports:

```tsx
export const UserProfile = () => {
  return <div>...</div>
}
```

- File naming: **kebab-case** for all files (`user-avatar-menu.tsx`, `slam-show.tsx`).
- No default exports.

## Server Functions (TanStack Start)

### File Organization

Split server-side code by concern:

```
src/server-functions/
├── slams.functions.ts   # createServerFn wrappers (safe to import anywhere)
├── slams.server.ts      # Raw DB queries / business logic (server-only)
└── slams.ts             # Shared types, schemas, constants (client-safe)
```

- `.functions.ts` — `createServerFn` wrappers. These get replaced with RPC stubs in the client bundle.
- `.server.ts` — DB queries, business logic. Only imported inside `.handler()`. Never reaches the client.
- `.ts` — Types, Valibot schemas, constants. Safe for both client and server.

### Input Validation

Always use `.inputValidator()` for server functions that accept parameters:

```tsx
export const fetchSlamDetails = createServerFn({ method: 'GET' })
  .inputValidator((data: { slamId: string }) => data)
  .handler(async ({ data }) => {
    // data.slamId is typed and validated
  })
```

### Naming

- `fetch*` — reads (`fetchSlams`, `fetchUserProfile`)
- `create*` / `update*` / `delete*` — writes
- `get*` — auth/session (`getCurrentUser`)

## Error Handling

**Throw** for unexpected or fatal errors — let TanStack error boundaries handle them:

```tsx
// Not found, DB failure, auth expired → throw
const user = await findUser(id)
if (!user) throw notFound()

// Redirects → use redirect(), never throw new Error
if (loggedIn) throw redirect({ to: '/' })
```

**Return result objects** for user-fixable errors (validation, business rules):

```tsx
// Validation failure → return so the component can show inline feedback
if (!result.success) {
  return { status: 'error' as const, message: result.issues[0]?.message }
}
return { status: 'success' as const, data: entry }
```

## Data Flow

```
Loader (SSR) → server function → DB
                                  ↓
Collection (client) → useLiveQuery → component
                                  ↓
Mutation → invalidate queryClient + router.invalidate()
```

1. **Loaders** call server functions for SSR data.
2. **Collections** + `useLiveQuery` provide client-side reactive data.
3. **Mutations** invalidate both `queryClient` and `router` after writes.

## Route Conventions

- `beforeLoad` for auth guards (e.g. `redirectIfLoggedIn`).
- Parallel data fetching in loaders with `Promise.all`.
- `<Link>` from `@tanstack/react-router` for all internal navigation. Never `<a href>` for internal routes.
- Never `window.location.href` — use `router.navigate()` / `router.invalidate()`.

## Styling

- Tailwind v4 with shadcn-style UI components in `@/components/ui/`.
- `cn()` from `@/lib/utils` for conditional class merging.
- `lucide-react` for icons.
- `sonner` for toast notifications.

## General

- No debug `console.log` in committed code. `console.error` only for actual error handling.
- Valibot for validation schemas (not Zod).
- Use `import type` for type-only imports.
