#!/usr/bin/env node
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";
import minimist from "minimist";

const args = process.argv.slice(2);
const dbArg = args.find(arg => arg.startsWith("--db="));
const routeArg = args.find(arg => arg.startsWith("--route="));

if (!dbArg || !routeArg) {
  console.error("Usage: node scripts/check-roles.js --db=./data/app.db --route=./app/api/subscribe/route.js");
  process.exit(1);
}

const dbPath = dbArg.split("=")[1];
const routePath = routeArg.split("=")[1];

async function main() {
  // Open DB
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Fetch roles from DB
  const roles = await db.all("SELECT DISTINCT role FROM users");
  console.log("📊 Roles in DB:", roles.map(r => r.role));

  // Read roles from route file
  const routeContent = fs.readFileSync(routePath, "utf8");
  const roleMatches = [...routeContent.matchAll(/role\s*:\s*['"`]([A-Z_]+)['"`]/g)];
  const rolesInCode = [...new Set(roleMatches.map(m => m[1]))];
  console.log("📄 Roles in code:", rolesInCode);

  // Compare
  const missingInDb = rolesInCode.filter(r => !roles.some(dbR => dbR.role === r));
  const missingInCode = roles.map(r => r.role).filter(r => !rolesInCode.includes(r));

  console.log("\n🔍 Comparison:");
  console.log(" - In code but not in DB:", missingInDb);
  console.log(" - In DB but not in code:", missingInCode);

  await db.close();
}

main().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
