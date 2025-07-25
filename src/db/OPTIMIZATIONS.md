# Database Query Optimizations

## Problem Identified

The application was making **85+ database queries per request**, which is excessive and causes performance issues.

## Root Causes Found

1. **Multiple `getAllSlams` calls**: Same query running multiple times in the same request
2. **Duplicate statistics printing**: The same stats were being printed repeatedly
3. **No caching**: Queries were being re-executed even when data hadn't changed
4. **Unnecessary queries**: Some queries were running without clear purpose

## Solutions Implemented

### 1. Removed Global Statistics Printing

- **Before**: Statistics printed on every request via `onRequest` handler
- **After**: Statistics only printed at the end of specific route loaders
- **Impact**: Eliminated duplicate statistics output

### 2. Added Route-Level Caching

Added caching to all major route loaders:

```typescript
requestEvent.cacheControl({
  maxAge: 300, // Cache for 5 minutes (homepage)
  staleWhileRevalidate: 60,
});
```

**Routes with caching:**

- `/` (homepage) - 5 minutes cache
- `/slams` - 2 minutes cache
- `/slams/show/[id]` - 1 minute cache
- `/slams/show/[id]/entries` - 1 minute cache
- `/artists` - 2 minutes cache
- `/artists/[artistName]` - 2 minutes cache
- `/[userName]` - 1 minute cache

### 3. Enhanced Query Logging

- All queries now use the `logQuery` wrapper for better tracking
- Query names make it easier to identify which queries are running
- Slow query warnings for queries >100ms

### 4. Optimized Query Structure

- Consolidated similar queries where possible
- Added proper error handling
- Improved query naming for better debugging

## Expected Results

### Before Optimization:

- 85+ queries per request
- Multiple duplicate queries
- No caching
- Repeated statistics output

### After Optimization:

- **Target: 10-20 queries per request** (80% reduction)
- No duplicate queries due to caching
- Proper caching with appropriate TTL
- Single statistics output per request

## Monitoring

Use the query logging to monitor:

1. **Query count per request** - Should be significantly lower
2. **Slow queries** - Look for queries >100ms
3. **Cache hits** - Verify caching is working
4. **Query patterns** - Identify any remaining N+1 problems

## Cache Strategy

| Route         | Cache Duration | Reason                         |
| ------------- | -------------- | ------------------------------ |
| Homepage      | 5 minutes      | Static content, rarely changes |
| Slams list    | 2 minutes      | Moderate change frequency      |
| Artist pages  | 2 minutes      | Moderate change frequency      |
| User profiles | 1 minute       | More dynamic content           |
| Slam details  | 1 minute       | More dynamic content           |

## Next Steps

1. **Monitor performance** after deployment
2. **Adjust cache durations** based on usage patterns
3. **Consider database indexes** for slow queries
4. **Implement query result caching** for frequently accessed data
5. **Add database connection pooling** if needed

## Files Modified

- `src/routes/layout.tsx` - Removed global statistics printing
- `src/routes/index.tsx` - Added caching and statistics
- `src/routes/slams/index.tsx` - Added caching and statistics
- `src/routes/slams/show/[id]/index.tsx` - Added caching and statistics
- `src/routes/slams/show/[id]/entries/index.tsx` - Added caching and statistics
- `src/routes/artists/index.tsx` - Added caching and statistics
- `src/routes/artists/[artistName]/index.tsx` - Added caching and statistics
- `src/routes/[userName]/index.tsx` - Added caching and statistics
