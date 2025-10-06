// This file is server-only and should not be imported in client-side code
// It re-exports all database functionality for server-side use only
// NOTE: We do NOT export from './index' as it contains server-side database connections
// NOTE: We do NOT export from './logger' as it imports from './index'
// NOTE: We do NOT export from './queries' as they import from './logger'

// Only export schemas - no database connections or queries
export * from './schema/artists'
export * from './schema/assets'
export * from './schema/artistAssets'
export * from './schema/slamEntries'
export * from './schema/slams'
export * from './schema/users'
export * from './schema/slamComments'
export * from './schema/slamRatings'
export * from './schema/slamEntryComments'
export * from './schema/slamEntryRatings'
export * from './schema/debug'
