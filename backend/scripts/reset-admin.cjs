const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@educationdoorway.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin123!";
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.adminUser.upsert({
    where: { email },
    create: {
      email,
      name: "Admin",
      passwordHash,
      role: "admin",
      active: true,
    },
    update: {
      passwordHash,
      role: "admin",
      active: true,
    },
  });
  console.log(`Admin ready: ${user.email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
