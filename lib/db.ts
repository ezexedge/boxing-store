import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

console.log("[v0] Initializing Prisma Client...")
console.log("[v0] NEON_DATABASE_URL exists:", !!process.env.DATABASE_URL)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

console.log("[v0] Prisma Client initialized")
