import { db as originalDb } from "./index";

// Track query statistics
const queryStats = {
  totalQueries: 0,
  slowQueries: 0,
  totalTime: 0,
};

// Enhanced logging wrapper
export async function logQuery<T>(
  queryName: string,
  queryFn: () => Promise<T>,
): Promise<T> {
  const startTime = performance.now();
  const timestamp = new Date().toISOString();

  try {
    console.log(`[DB Query Start] ${timestamp} | ${queryName}`);

    const result = await queryFn();

    const endTime = performance.now();
    const duration = endTime - startTime;
    const durationMs = Math.round(duration);

    // Update statistics
    queryStats.totalQueries++;
    queryStats.totalTime += duration;

    console.log(`[DB Query End] ${timestamp} | ${queryName} | ${durationMs}ms`);

    // Log slow queries
    if (duration > 100) {
      queryStats.slowQueries++;
      console.warn(`[DB Query SLOW] ${queryName} took ${durationMs}ms`);
    }

    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    const durationMs = Math.round(duration);

    console.error(
      `[DB Query ERROR] ${timestamp} | ${queryName} | ${durationMs}ms | Error:`,
      error,
    );
    throw error;
  }
}

// Function to print query statistics
export function printQueryStats() {
  console.log("\n=== Database Query Statistics ===");
  console.log(`Total Queries: ${queryStats.totalQueries}`);
  console.log(`Slow Queries (>100ms): ${queryStats.slowQueries}`);
  console.log(
    `Average Query Time: ${queryStats.totalQueries > 0 ? Math.round(queryStats.totalTime / queryStats.totalQueries) : 0}ms`,
  );
  console.log(`Total Query Time: ${Math.round(queryStats.totalTime)}ms`);
  console.log("================================\n");
}

// Export the original db for direct use
export const db = originalDb;