import { PrismaClient } from "@prisma/client";

var prisma: PrismaClient;
declare global {
  function someFunction(): string;
  var prisma: string;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
