const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.NEXTAUTH_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@rccgsigns.com';
  const adminPasswordHash = process.env.NEXTAUTH_ADMIN_PASSWORD_HASH;
  const adminPasswordPlain = process.env.NEXTAUTH_ADMIN_PASSWORD;

  let passwordToStore = adminPasswordHash;
  if (!passwordToStore) {
    if (adminPasswordPlain) {
      passwordToStore = bcrypt.hashSync(adminPasswordPlain, 10);
      console.log('Hashed admin password from NEXTAUTH_ADMIN_PASSWORD');
    } else {
      // fallback: create a hashed default password (not for production)
      passwordToStore = bcrypt.hashSync('admin123', 10);
      console.warn('No admin password provided in env; using default hashed password (admin123)');
    }
  }

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      password: passwordToStore,
      name: 'Admin User',
    },
    create: {
      email: adminEmail,
      password: passwordToStore,
      name: 'Admin User',
    },
  });

  console.log('Upserted admin user:', admin.email);
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
