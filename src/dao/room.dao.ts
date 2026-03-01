import { Prisma } from "@prisma/client";
import prisma from "./prisma";

const create = async (data: Prisma.RoomCreateInput) =>
  await prisma.room.create({
    data,
    include: { players: { select: { name: true, wins: true, id: true } } },
  });

const findByOwnerId = async (ownerId: number) =>
  await prisma.room.findUnique({ where: { ownerId } });

const findByCode = async (code: string) =>
  await prisma.room.findUnique({ where: { code } });

const addPlayerToRoom = async (roomId: number, newPlayerId: number) =>
  await prisma.room.update({
    where: { id: roomId },
    data: { players: { connect: { id: newPlayerId } } },
    include: { players: { select: { name: true, wins: true, id: true } } },
  });

const removePlayerFromRoom = async (roomId: number, playerId: number) =>
  await prisma.room.update({
    where: { id: roomId },
    data: {
      players: {
        disconnect: { id: playerId },
      },
    },
    include: { players: { select: { name: true, wins: true, id: true } } },
  });

const deleteById = (id: number) => prisma.room.delete({ where: { id } });

const findUnique = prisma.room.findUnique;

export default {
  create,
  findByOwnerId,
  findByCode,
  addPlayerToRoom,
  removePlayerFromRoom,
  findUnique,
  deleteById,
};
