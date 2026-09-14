import { prisma } from "../src/lib/prisma.js";

const order = [
  { key: "delegate", sortOrder: 0, youtubePlaylistId: "PLE4zxKdPQf64" },
  { key: "student", sortOrder: 1, youtubePlaylistId: "PLXHb83fGA3Ms" },
  { key: "guardian", sortOrder: 2, youtubePlaylistId: "PLdfCE6eITZIc" },
];

for (const item of order) {
  await prisma.storyCategory.updateMany({ where: { key: item.key }, data: item });
}

const rows = await prisma.storyCategory.findMany({
  orderBy: { sortOrder: "asc" },
  select: { key: true, sortOrder: true, youtubePlaylistId: true },
});
console.log(rows);
await prisma.$disconnect();
