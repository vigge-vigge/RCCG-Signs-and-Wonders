import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@rccgsigns.com' },
    update: {},
    create: {
      email: 'admin@rccgsigns.com',
      password: 'admin123', // In production, this should be hashed
      name: 'Admin User',
    },
  });

  console.log('Created admin user:', admin);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
