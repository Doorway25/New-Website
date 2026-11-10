const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

(async () => {
  const u = await prisma.adminUser.findUnique({
    where: { email: "admin@educationdoorway.com" },
  });
  console.log({
    found: !!u,
    email: u?.email,
    active: u?.active,
    role: u?.role,
  });
  console.log("password match:", u ? await bcrypt.compare("Admin123!", u.passwordHash) : false);
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
