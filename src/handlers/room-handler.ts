import { RedisClientType } from "redis";
import { Server, Socket } from "socket.io";
import { GameState } from "../types";
import { GameStatus } from "../enums";

type JoinRoomParams = {
  roomId: string;
  username: string;
};

export default (io: Server, socket: Socket, pubClient: RedisClientType) => {
  const join = async ({ roomId, username }: JoinRoomParams) => {
    socket.join(roomId);
    console.log(`[EVENT] ${username} joined ${roomId}`);
    let stateRaw = await pubClient.get(`game:${roomId}`);
    const state: GameState = stateRaw
      ? JSON.parse(stateRaw)
      : {
          roomId,
          status: GameStatus.LOBBY,
          turnIndex: 0,
          players: [],
          board: [],
          deck: [],
        };

    if (!state.players.some((p) => p.id === socket.id)) {
      state.players.push({ id: socket.id, username, hand: [] });
    }

    await pubClient.set(`game:${roomId}`, JSON.stringify(state), { EX: 3600 });
    io.to(roomId).emit("room:update", state);
  };

  const leave = async ({ roomId }: JoinRoomParams) => {
    socket.leave(roomId);
    console.log(`[EVENT] ${socket.id} left ${roomId}`);
    let stateRaw = await pubClient.get(`game:${roomId}`);
    if (!stateRaw) return;
    const state: GameState = JSON.parse(stateRaw);
    state.players = state.players.filter((p) => p.id !== socket.id);
    socket.leave(roomId);
    if (state.players.length === 0) {
      await pubClient.del(`game:${roomId}`);
      console.log(`Deleted empty room: ${roomId}`);
    } else {
      await pubClient.set(`game:${roomId}`, JSON.stringify(state));
      io.to(roomId).emit("room:update", state);
    }
  };

  const disconnecting = async () => {
    const rooms = Array.from(socket.rooms);
    for (const roomId of rooms) {
      if (roomId !== socket.id) {
        const stateRaw = await pubClient.get(`game:${roomId}`);
        if (!stateRaw) continue;
        const state: GameState = JSON.parse(stateRaw);
        state.players = state.players.filter((p) => p.id !== socket.id);
        if (state.players.length === 0) {
          await pubClient.set(`game:${roomId}`, JSON.stringify(state), {
            expiration: { type: "EX", value: 300 },
          });
          console.log(
            `Last player disconnected. Set room ${roomId} for deletion.`,
          );
        } else {
          await pubClient.set(`game:${roomId}`, JSON.stringify(state), {
            expiration: { type: "EX", value: 3600 },
          });
          io.to(roomId).emit("room:update", state);
        }
      }
    }
  };

  socket.on("disconnecting", disconnecting);
  socket.on("room:join", join);
  socket.on("room:leave", leave);
};
