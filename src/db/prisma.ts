import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma_client/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export default prisma;
