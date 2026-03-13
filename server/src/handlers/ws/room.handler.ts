import { Server, Socket } from "socket.io";
import RoomDao from "../../dao/room.dao";

export default function assignRoomHandlers(io: Server, socket: Socket): void {
  async function roomJoin({
    roomCode,
    userId,
  }: {
    roomCode: string;
    userId: number;
  }): Promise<void> {
    const room = await RoomDao.findByCode(roomCode);
    if (!room) {
      console.log(`Room with code '${roomCode}' was not found`);
      return;
    }
    const playerInRoom = room.players.some((player) => player.id === userId);
    if (!playerInRoom) {
      console.log(`Player is not in room`);
      return;
    }
    socket.join(room.code);
    socket.broadcast.to(room.code).emit("room:update", room);
  }

  async function roomLeave({
    roomCode,
    userId,
  }: {
    roomCode: string;
    userId: number;
  }): Promise<void> {
    const room = await RoomDao.findByCode(roomCode);
    if (!room) {
      console.log(`Room with code '${roomCode}' was not found`);
      return;
    }
    const playerInRoom = room.players.some((player) => player.id === userId);
    if (playerInRoom) {
      console.log("Player is still in room");
      return;
    }
    socket.leave(room.code);
    io.to(room.code).emit("room:update", room);
  }

  socket.on("room:join", roomJoin);
  socket.on("room:leave", roomLeave);
}
