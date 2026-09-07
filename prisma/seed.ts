import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const departments = [
  { name: "Roads", slug: "roads", icon: "Car", color: "civic-blue" },
  { name: "Garbage & Waste", slug: "garbage", icon: "Trash2", color: "civic-green" },
  { name: "Water Supply", slug: "water", icon: "Droplet", color: "civic-cyan" },
  { name: "Electricity", slug: "electricity", icon: "Zap", color: "civic-orange" },
  { name: "Drainage", slug: "drainage", icon: "Waves", color: "civic-purple" },
  { name: "Streetlights", slug: "streetlights", icon: "Lightbulb", color: "civic-rose" },
  { name: "Public Safety", slug: "public-safety", icon: "ShieldAlert", color: "red-600" },
  { name: "Other", slug: "other", icon: "MoreHorizontal", color: "slate-500" },
];

async function main() {
  for (const d of departments) {
    await prisma.department.upsert({
      where: { slug: d.slug },
      update: {},
      create: d,
    });
  }
}

main().finally(() => prisma.$disconnect());