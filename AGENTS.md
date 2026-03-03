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

### Composition & File Structure

Prefer breaking pages and components into small, composable pieces with semantic names. The return JSX should read like an outline — you shouldn't have to scroll or guess what a section does.

Co-locate child components in a `components/` folder inside the parent's folder. Nesting mirrors the component tree:

```
src/components/
├── header/
│   ├── header.tsx              # Component definition
│   ├── index.ts                # export { Header } from './header'
│   └── components/
│       ├── nav-links.tsx       # Leaf — no folder needed
│       ├── mobile-menu.tsx
│       └── user-menu/
│           ├── user-menu.tsx
│           ├── index.ts        # export { UserMenu } from './user-menu'
│           └── components/
│               └── avatar.tsx
```

Every folder gets an `index.ts` barrel that re-exports from the main file. The component itself is **never** in the index — the index only re-exports. This keeps imports clean:

```tsx
// Good — import from the folder
import { Header } from '@/components/header'
import { UserMenu } from '@/components/header/components/user-menu'

// Bad — import from the file directly
import { Header } from '@/components/header/header'
```

The parent reads clearly:

```tsx
export const Header = () => {
  return (
    <header>
      <Logo />
      <NavLinks />
      <UserMenu />
      <MobileMenu />
    </header>
  )
}
```

Rules:
- A component's children live in `<parent>/components/`.
- If a child has its own children, it gets its own folder with the same pattern.
- Every component folder has an `index.ts` that re-exports from the component file. Leaf components (no children) don't need a folder.
- Always named exports, never default exports.
- Shared/reusable primitives (buttons, inputs, etc.) stay in `src/components/ui/`.

### Composition Inside Routes

The same nesting pattern applies within `src/routes/`. Route-specific components live next to the route that uses them — not in a global components folder.

TanStack Router uses file-based routing, so **non-route files and folders must be prefixed with `-`** to be ignored by the router. The route page itself stays as `index.tsx` (as expected by the router).

```
src/routes/slams/show/$id/
├── index.tsx                     # Route page (the only file the router sees)
└── -components/
    ├── slam-header.tsx           # Leaf — no folder needed
    ├── slam-entries.tsx
    └── join-form/
        ├── join-form.tsx
        ├── index.ts              # export { JoinForm } from './join-form'
        └── components/
            └── itch-link-input.tsx
```

Only the **first level** needs the `-` prefix — once inside a `-` prefixed folder, TanStack Router ignores everything beneath it. So nested child folders use plain `components/`, not `-components/`.

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
Loader (SSR) → server function → DB       ← provides initial HTML
Collection (client) → useLiveQuery → component  ← provides reactive data
Mutation → invalidate queryClient + router.invalidate()
```

1. **Loaders** call server functions for SSR data.
2. **Collections** + `useLiveQuery` provide client-side reactive data.
3. **Mutations** invalidate both `queryClient` and `router` after writes.

### No Prop Drilling — Components Own Their Data

Components should know how to get the data they need. Don't pass data through props when it can be queried from a collection.

**Primary data source:** `useLiveQuery` on TanStack DB collections.
**SSR fallback:** `useLoaderData({ from: '...' })` for hydration-safe initial data.
**Route context:** `useParams({ from: '...' })` for filtering (no identifier props needed).

```tsx
// Good — component owns its data
export const ArtistHeader = () => {
  const { artistName } = useParams({ from: '/artists/$artistName/' })
  const loaderData = useLoaderData({ from: '/artists/$artistName/' })

  const { data: artists = [] } = useLiveQuery(query =>
    query.from({ artistItem: artistsCollection })
      .where(({ artistItem }) => eq(artistItem.artist.name, artistName)),
  )

  const artist = artists[0]?.artist || loaderData.artist
  // ...
}

// Bad — prop drilling from page
export const ArtistHeader = ({ artist, assetsCount, slamsCount }: IArtistHeaderProps) => {
  // ...
}
```

The page component becomes a pure composition shell — no data hooks, no props:

```tsx
const ArtistProfile = () => {
  return (
    <div>
      <ArtistHeader />
      <AssetsSection />
      <SlamsSection />
    </div>
  )
}
```

**When props are OK:**
- Passing children or render configuration (not data)
- Shared UI primitives (`Button`, `Card`, etc.) that are data-agnostic
- List items where the parent maps over a collection and passes each item (e.g. `AssetCard` receives a single asset from `AssetsSection`'s map)

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
- Explicit variable names — no single-letter shorthands. Exception: comparator callbacks like `.sort((a, b) => ...)` or short-lived iterators where the meaning is obvious from context (`e` in event handlers).
- Derive parameter types from their source interface using indexed access (`Interface['field']`), not by re-declaring the primitive. This keeps types traceable and auto-updates if the source changes.

```tsx
// Good — type is derived from the source
function fetchAsset(id: IItchAssetData['id']) { ... }

// Bad — type is duplicated, no connection to the source
function fetchAsset(id: number) { ... }
```
