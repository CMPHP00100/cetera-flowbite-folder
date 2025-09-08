// lib/d1Local.js
let DB;

if (process.env.NODE_ENV === "production") {
  // Only import @cloudflare/d1 at runtime to avoid Next.js/Turbopack errors
  const { D1Database } = await import("@cloudflare/d1");

  DB = new D1Database({
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID, // <-- make sure this is databaseId, not databaseName
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
  });

  console.log("✅ Connected to D1 database (production)");
} else {
  console.log("⚡ Skipping D1 import in development environment");
}

// ✅ Add this helper function
export function getD1() {
  if (!DB) {
    throw new Error("D1 database not initialized. Make sure you're in production or using USE_D1=1");
  }
  return DB;
}

export { DB };
