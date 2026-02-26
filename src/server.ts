import { createClient, RedisClientType } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import roomHandler from "./handlers/room-handler";
import gameHandler from "./handlers/game-handler";

dotenv.config({ quiet: true });

const PORT = Number.parseInt(process.env.PORT ?? "3000");
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const pubClient = createClient({ url: REDIS_URL });
const subClient = pubClient.duplicate();
const gameDataClient = pubClient.duplicate();

async function startServer() {
  await Promise.all([
    pubClient.connect(),
    subClient.connect(),
    gameDataClient.connect(),
  ]);
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" },
    adapter: createAdapter(pubClient, subClient),
  });
  io.on("connection", async (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);
    roomHandler(io, socket, gameDataClient as RedisClientType);
    gameHandler(io, socket, gameDataClient as RedisClientType);
    socket.on("disconnect", (_reason, _details) =>
      console.log(`Client disconnected ${socket.id}`),
    );
  });

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
