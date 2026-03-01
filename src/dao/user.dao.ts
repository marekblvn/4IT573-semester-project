import { Prisma } from "@prisma/client";
import prisma from "./prisma";

const create = async (
  data: Pick<Prisma.UserCreateInput, "username" | "name" | "password">,
) => await prisma.user.create({ data });

const findByUsername = async (username: string) =>
  await prisma.user.findUnique({ where: { username } });

const findById = async (id: number) =>
  await prisma.user.findUnique({ where: { id } });

export default {
  create,
  findByUsername,
  findById,
};
