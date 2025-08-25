import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('✅ Prisma works and connected to DB!');
  } catch (e) {
    console.error('❌ Prisma failed to connect:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
