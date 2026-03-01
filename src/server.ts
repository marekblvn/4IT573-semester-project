import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import createRoomRouter from "./routes/room.routes";
import errorHandler from "./handlers/error.handler";
import createAuthRouter from "./routes/auth.routes";
import authMiddleware from "./middlewares/auth.middleware";

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
    socket.on("disconnect", (_reason, _details) =>
      console.log(`Client disconnected ${socket.id}`),
    );
  });

  const roomRouter = createRoomRouter();
  const authRouter = createAuthRouter();

  app.use(express.json());

  app.use("/api/auth", authRouter);
  app.use("/api/room", authMiddleware, roomRouter);

  app.use(errorHandler);

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
