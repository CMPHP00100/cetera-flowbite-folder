//lib/prisma.ts
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaD1 } from "@prisma/adapter-d1";
import type { D1Database } from "@cloudflare/workers-types";

declare global {
  var prisma: PrismaClient | undefined;
}

export const createPrismaClient = (d1Binding?: D1Database) => {
  const adapter = d1Binding ? new PrismaD1(d1Binding) : undefined;
  return new PrismaClient({ adapter }).$extends(withAccelerate());
};

// Initialize based on environment
const prisma =
  global.prisma ||
  (process.env.DB
    ? createPrismaClient(process.env.DB as unknown as D1Database)
    : createPrismaClient());

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
