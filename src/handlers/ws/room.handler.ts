import { Server, Socket } from "socket.io";
import roomDao from "../../dao/room.dao";

export default function assignRoomHandlers(io: Server, socket: Socket): void {
  async function roomJoin({ roomCode }: { roomCode: string }) {
    const room = roomDao.findByCode(roomCode);
  }
}
