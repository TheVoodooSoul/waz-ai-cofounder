import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Lazy initialization - only create PrismaClient when actually needed
let _prisma: PrismaClient | undefined

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    if (!_prisma) {
      _prisma = globalForPrisma.prisma ?? new PrismaClient()
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = _prisma
      }
    }
    return Reflect.get(_prisma, prop, receiver)
  }
})
