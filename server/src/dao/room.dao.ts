import { Prisma } from "@prisma/client";
import prisma from "./prisma";

class RoomDao {
  private readonly db = prisma.room;

  async create(data: Prisma.RoomCreateInput) {
    return await this.db.create({
      data,
      include: { players: { select: { name: true, wins: true, id: true } } },
    });
  }

  async findByOwnerId(ownerId: number) {
    return await this.db.findUnique({ where: { ownerId } });
  }

  async findByCode(code: string) {
    return await prisma.room.findUnique({
      where: { code },
      include: {
        players: { omit: { password: true } },
      },
    });
  }

  async addPlayerToRoom(roomId: number, newPlayerId: number) {
    return await prisma.room.update({
      where: { id: roomId },
      data: { players: { connect: { id: newPlayerId } } },
      include: { players: { select: { name: true, wins: true, id: true } } },
    });
  }

  async removePlayerFromRoom(roomId: number, playerId: number) {
    return await prisma.room.update({
      where: { id: roomId },
      data: {
        players: {
          disconnect: { id: playerId },
        },
      },
      include: { players: { select: { name: true, wins: true, id: true } } },
    });
  }

  async deleteById(id: number) {
    return await prisma.room.delete({ where: { id } });
  }

  get delegate() {
    return this.db;
  }
}

export default new RoomDao();
