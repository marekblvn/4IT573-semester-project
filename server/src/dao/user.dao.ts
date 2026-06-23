import { Prisma } from "@prisma/client";
import prisma from "./prisma";

class UserDao {
  private readonly db = prisma.user;

  async create(
    data: Pick<Prisma.UserCreateInput, "username" | "name" | "password">,
  ) {
    return await prisma.user.create({ data });
  }

  async findByUsername(username: string) {
    return await prisma.user.findUnique({ where: { username } });
  }

  async findById(id: number) {
    return await prisma.user.findUnique({ where: { id } });
  }

  get delegate() {
    return this.db;
  }
}

export default new UserDao();
