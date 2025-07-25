# Database Query Logging

This directory contains the database setup with comprehensive query logging to help debug performance issues and identify hanging or excessive queries.

## Features

### 1. Basic Query Logging

All database queries are automatically logged with:

- Timestamp
- Query preview (first 100 characters)
- Query parameters
- Execution time

### 2. Enhanced Query Logging

Use the `logQuery` wrapper for detailed tracking:

- Query name for easy identification
- Start and end timestamps
- Execution duration
- Slow query warnings (>100ms)
- Error tracking
- Query statistics

### 3. Request-Level Statistics

At the end of each request, statistics are printed showing:

- Total queries executed
- Number of slow queries
- Average query time
- Total query time

## Usage

### Basic Usage (Automatic)

All queries using the `db` instance are automatically logged:

```typescript
import { db } from "~/db/logger";

const result = await db.select().from(users).where(eq(users.id, 1));
```

### Enhanced Usage (Recommended)

Wrap your queries with the `logQuery` function for better tracking:

```typescript
import { db, logQuery } from "~/db/logger";

const user = await logQuery("getUserById", async () => {
  return await db.select().from(users).where(eq(users.id, 1));
});
```

### Manual Statistics

Print statistics manually:

```typescript
import { printQueryStats } from "~/db/logger";

// ... your queries ...

printQueryStats();
```

## Log Output Examples

### Basic Query Log

```
[DB Query] 2024-01-15T10:30:45.123Z | SELECT * FROM users WHERE id = $1
[DB Query] Params: [1]
```

### Enhanced Query Log

```
[DB Query Start] 2024-01-15T10:30:45.123Z | getUserById
[DB Query End] 2024-01-15T10:30:45.145Z | getUserById | 22ms
```

### Slow Query Warning

```
[DB Query SLOW] getUserById took 150ms
```

### Request Statistics

```
=== Database Query Statistics ===
Total Queries: 5
Slow Queries (>100ms): 1
Average Query Time: 45ms
Total Query Time: 225ms
================================
```

## Debugging Tips

1. **Identify Slow Queries**: Look for queries taking >100ms
2. **Check Query Frequency**: Look for repeated queries that might indicate N+1 problems
3. **Monitor Request Patterns**: Check if certain pages generate excessive queries
4. **Track Query Parameters**: Verify that queries are using the expected parameters

## Performance Thresholds

- **Normal**: <100ms
- **Slow**: 100ms - 1000ms (warning logged)
- **Very Slow**: >1000ms (warning logged)

## Files Modified

- `src/db/index.ts` - Added basic query logging
- `src/db/logger.ts` - Enhanced logging utilities
- `src/db/queries/*.ts` - Updated to use enhanced logging
- `src/routes/*.tsx` - Updated route loaders to use enhanced logging
- `src/routes/layout.tsx` - Added request-level statistics
