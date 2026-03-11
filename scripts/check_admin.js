const fs = require('fs');
// Simple .env loader for .env.local and .env (avoid adding dotenv dependency)
function loadEnvFile(path) {
  try {
    const content = fs.readFileSync(path, 'utf8');
    content.split(/\r?\n/).forEach((line) => {
      line = line.trim();
      if (!line || line.startsWith('#')) return;
      const idx = line.indexOf('=');
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    });
  } catch (e) {
    // ignore missing files
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

(async () => {
  const prisma = new PrismaClient();
  try {
    const email = process.env.NEXTAUTH_ADMIN_EMAIL;
    console.log('Current working dir:', process.cwd());
    const dbPath = process.env.DATABASE_URL || process.env.DATABASE || '<none>';
    console.log('DATABASE_URL env:', dbPath);
    const fsPath = dbPath && dbPath.startsWith('file:') ? dbPath.replace('file:','') : dbPath;
    console.log('Resolved DB file path exists?:', fsPath ? fs.existsSync(fsPath) : 'no dbPath');
    console.log('Using env email:', email);
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      console.log('Admin not found in DB for email:', email);
      return;
    }
    console.log('Admin found:', { email: admin.email, id: admin.id, passwordPreview: admin.password.slice(0, 60) + '...' });
    const match = bcrypt.compareSync('Jesusislord2026', admin.password);
    console.log('bcrypt.compareSync with Jesusislord2026 =>', match);
  } catch (e) {
    console.error(e);
  } finally {
    await (new PrismaClient()).$disconnect();
  }
})();
