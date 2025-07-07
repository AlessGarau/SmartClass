import { seed } from "drizzle-seed";
import { database } from "./database";
import * as schema from "./schema";

async function main() {
  console.log("Seeding database...");
  
  await seed(database, schema);
  
  console.log("Database seeded successfully!");
  process.exit(0);
}

main().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});