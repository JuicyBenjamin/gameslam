import { getUserById, getUserByName } from "./queries/users";
import { getAllSlams, getSlamById } from "./queries/slams";
import { printQueryStats } from "./logger";

// Test function to demonstrate logging
export async function testDatabaseLogging() {
  console.log("Starting database query logging test...\n");

  try {
    // Test user queries
    console.log("Testing user queries...");
    await getUserByName("test-user");
    await getUserById("test-id");

    // Test slam queries
    console.log("\nTesting slam queries...");
    await getAllSlams();
    await getSlamById("test-slam-id");

    // Print final statistics
    console.log("\nFinal Query Statistics:");
    printQueryStats();
  } catch (error) {
    console.error("Error during testing:", error);
  }
}

// Export for use in development
export { printQueryStats };
