import { Request, Response } from "express";
import { getCurrentUser } from "../../contexts/user.context";
import UserDao from "../../dao/user.dao";
import RoomDao from "../../dao/room.dao";
import { ApplicationError } from "../../errors/application.error";
import randomCode from "../../utils/random-code";
import validate from "../../utils/validate";
import { JoinRoomSchema, LeaveRoomSchema } from "../../schemas/room.schema";

export const create = async (_req: Request, res: Response) => {
  const { userId } = getCurrentUser()!;
  const user = await UserDao.findById(userId);
  if (user?.roomId) {
    throw new ApplicationError(
      400,
      "ALREADY_IN_ROOM",
      "User is already in a room",
    );
  }

  const retries = 5;
  let iteration = 1;
  let uniqueCode = randomCode(5);
  let existingRoom = await RoomDao.findByCode(uniqueCode);
  while (existingRoom && iteration <= retries) {
    uniqueCode = randomCode(5);
    existingRoom = await RoomDao.findByCode(uniqueCode);
    iteration++;
  }
  if (iteration > retries) {
    throw new ApplicationError(
      500,
      "COULDNT_GENERATE_ROOM_CODE",
      "Could not generate unique room code",
    );
  }
  const roomCode = uniqueCode;
  let room;
  try {
    room = await RoomDao.create({
      code: roomCode,
      status: "LOBBY",
      owner: { connect: { id: userId } },
      players: { connect: [{ id: userId }] },
    });
  } catch (error) {
    throw new ApplicationError(
      500,
      "ROOM_DAO_FAILED",
      "roomDao.create failed unexpectedly",
    );
  }
  return res.status(201).json({ room });
};

export const join = async (req: Request, res: Response) => {
  const { roomCode } = await validate(JoinRoomSchema, req.body);
  const { userId } = getCurrentUser()!;
  const room = await RoomDao.delegate.findUnique({
    where: { code: roomCode },
    include: { _count: { select: { players: true } } },
  });
  if (!room) {
    throw new ApplicationError(
      404,
      "ROOM_NOT_FOUND",
      `Could not find room with code '${roomCode}'`,
    );
  }
  if (room._count.players >= 4) {
    throw new ApplicationError(400, "ROOM_FULL", `Room '${roomCode}' is full`);
  }
  const updatedRoom = await RoomDao.addPlayerToRoom(room.id, userId);
  return res.status(200).json({ room: updatedRoom });
};

export const leave = async (req: Request, res: Response) => {
  const { roomCode } = await validate(LeaveRoomSchema, req.body);
  const { userId } = getCurrentUser()!;
  const room = await RoomDao.delegate.findUnique({
    where: { code: roomCode },
    include: { _count: { select: { players: true } } },
  });
  if (!room) {
    throw new ApplicationError(
      404,
      "ROOM_NOT_FOUND",
      `Could not find room with code '${roomCode}'`,
    );
  }

  const updatedRoom = await RoomDao.removePlayerFromRoom(room.id, userId);

  if (updatedRoom.players.length <= 0) {
    await RoomDao.deleteById(room.id);
  }

  return res.status(200).json();
};
