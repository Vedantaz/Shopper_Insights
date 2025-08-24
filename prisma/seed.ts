import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'System Administrator Default',
      email: 'admin@example.com',
      address: 'HQ',
      role: 'ADMIN',
      passwordHash: await bcrypt.hash('Admin@123', 10),
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      name: 'Default Store Owner Account',
      email: 'owner@example.com',
      address: 'Owner Address',
      role: 'OWNER',
      passwordHash: await bcrypt.hash('Owner@123', 10),
    },
  });

  await prisma.store.upsert({
    where: { ownerId: owner.id },
    update: {},
    create: {
      name: 'Blue Mart',
      email: 'store@bluemart.com',
      address: '221B Baker St',
      ownerId: owner.id,
    },
  });

  console.log({ admin: admin.email });
}
main().finally(() => prisma.$disconnect());
