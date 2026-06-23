import { configDotenv } from "dotenv";
configDotenv({ quiet: true });
import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import os from "node:os";
import { PORT } from "./config";
import { db } from "./db";
import {
  generateToken,
  authenticateJWT,
  authenticateSocket,
  AuthenticatedRequest,
} from "./auth";
import { lobbyManager } from "./game/lobby";

// Detect local network IP address
function getLocalIpAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Broadcast game state helper
const broadcastGameState = (gameId: string) => {
  const game = lobbyManager.getGame(gameId);
  if (!game) return;

  const roomName = `game_${gameId.toUpperCase()}`;
  const socketIds = io.sockets.adapter.rooms.get(roomName);

  if (socketIds) {
    for (const socketId of socketIds) {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        const session = lobbyManager.getSession(socketId);
        if (session) {
          if (session.deviceType === "mobile") {
            // Mobile client gets state with their private hand
            socket.emit(
              "game-state",
              game.getGameState(session.username),
            );
          } else {
            // PC client gets state with all hands obscured
            socket.emit(
              "game-state",
              game.getGameState(undefined),
            );
          }
        }
      }
    }
  }
};

// --- HTTP Routes ---

// Get local network IP and config (helpful for mobile device scanning QR code)
app.get("/api/network-info", (req, res) => {
  res.json({
    localIp: getLocalIpAddress(),
    port: PORT,
  });
});

// Authentication: Register
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({
        error: "Username and password are required",
      });
  }

  try {
    const user = await db.createUser(username, password);
    const token = generateToken(user.username);
    res.status(201).json({
      token,
      user: {
        username: user.username,
        gamesPlayed: user.gamesPlayed,
        gamesWon: user.gamesWon,
      },
    });
  } catch (error: any) {
    res
      .status(400)
      .json({
        error: error.message || "Registration failed",
      });
  }
});

// Authentication: Login
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({
        error: "Username and password are required",
      });
  }

  const user = db.getUser(username);
  if (!user) {
    return res
      .status(401)
      .json({ error: "Invalid username or password" });
  }

  const bcrypt = require("bcryptjs");
  const valid = await bcrypt.compare(
    password,
    user.passwordHash,
  );
  if (!valid) {
    return res
      .status(401)
      .json({ error: "Invalid username or password" });
  }

  const token = generateToken(user.username);
  res.json({
    token,
    user: {
      username: user.username,
      gamesPlayed: user.gamesPlayed,
      gamesWon: user.gamesWon,
    },
  });
});

// Authentication: Get Profile
app.get(
  "/api/auth/me",
  authenticateJWT,
  (req: AuthenticatedRequest, res) => {
    if (!req.user)
      return res
        .status(401)
        .json({ error: "Unauthorized" });

    const user = db.getUser(req.user.username);
    if (!user)
      return res
        .status(404)
        .json({ error: "User not found" });

    res.json({
      username: user.username,
      gamesPlayed: user.gamesPlayed,
      gamesWon: user.gamesWon,
    });
  },
);

// Lobby: Create game
app.post(
  "/api/lobby/create",
  authenticateJWT,
  (req: AuthenticatedRequest, res) => {
    if (!req.user)
      return res
        .status(401)
        .json({ error: "Unauthorized" });

    const game = lobbyManager.createGame();
    game.addPlayer(req.user.username);

    res.json({ gameId: game.gameId });
  },
);

// Lobby: List active games
app.get("/api/lobby/list", authenticateJWT, (_req, res) => {
  const gamesList = lobbyManager.getGames().map((game) => ({
    gameId: game.gameId,
    status: game.status,
    playerCount: game.players.length,
  }));
  res.json(gamesList);
});

// Lobby: Check if game exists and has space
app.get(
  "/api/lobby/check/:gameId",
  authenticateJWT,
  (req: AuthenticatedRequest, res) => {
    const { gameId } = req.params;
    const game = lobbyManager.getGame(gameId as string);
    if (!game) {
      return res
        .status(404)
        .json({ error: "Game lobby not found" });
    }

    const username = req.user?.username;
    const alreadyIn = username && game.getPlayer(username);

    if (game.status !== "lobby" && !alreadyIn) {
      return res
        .status(400)
        .json({ error: "Game already started" });
    }

    if (game.players.length >= 4 && !alreadyIn) {
      return res
        .status(400)
        .json({
          error: "Game lobby is full (max 4 players)",
        });
    }

    res.json({
      gameId: game.gameId,
      status: game.status,
      players: game.players.map((p) => ({
        username: p.username,
        isReady: p.isReady,
      })),
    });
  },
);

// --- Socket.io Signalling & Gameplay ---

io.use(authenticateSocket);

io.on("connection", (socket: any) => {
  const username = socket.username;

  socket.on(
    "join-game",
    ({
      gameId,
      deviceType,
    }: {
      gameId: string;
      deviceType: "pc" | "mobile";
    }) => {
      const game = lobbyManager.getGame(gameId);
      if (!game) {
        socket.emit("error-msg", "Game not found");
        return;
      }

      // Try adding the player to the game if not already there
      const success = game.addPlayer(username);
      if (!success) {
        socket.emit(
          "error-msg",
          "Cannot join game. Lobby full or already playing.",
        );
        return;
      }

      // Register connection in Lobby Manager
      const registered = lobbyManager.registerSocket(
        socket.id,
        username,
        gameId,
        deviceType,
      );
      if (!registered) {
        socket.emit(
          "error-msg",
          "Failed to register device session.",
        );
        return;
      }

      // Join Socket.io room
      const roomName = `game_${game.gameId}`;
      socket.join(roomName);

      console.log(
        `[Socket] User ${username} connected via ${deviceType} to game ${game.gameId}`,
      );

      // Notify others in lobby
      broadcastGameState(game.gameId);
    },
  );

  socket.on(
    "set-ready",
    ({ ready }: { ready: boolean }) => {
      const session = lobbyManager.getSession(socket.id);
      if (!session) return;

      const game = lobbyManager.getGame(session.gameId);
      if (!game) return;

      game.setReady(username, ready);
      broadcastGameState(game.gameId);
    },
  );

  socket.on("start-game", () => {
    const session = lobbyManager.getSession(socket.id);
    if (!session) return;

    const game = lobbyManager.getGame(session.gameId);
    if (!game) return;

    const started = game.startGame();
    if (started) {
      broadcastGameState(game.gameId);
    } else {
      socket.emit(
        "error-msg",
        "Cannot start game. Make sure all players are ready (min 2, max 4 players).",
      );
    }
  });

  socket.on(
    "play-card",
    ({ cardId }: { cardId: string }) => {
      const session = lobbyManager.getSession(socket.id);
      if (!session) return;

      const game = lobbyManager.getGame(session.gameId);
      if (!game) return;

      const success = game.playCard(username, cardId);
      if (success) {
        broadcastGameState(game.gameId);
      } else {
        socket.emit(
          "error-msg",
          "Invalid play. Not your turn or card cannot be played.",
        );
      }
    },
  );

  socket.on("select-color", ({ color }: { color: any }) => {
    const session = lobbyManager.getSession(socket.id);
    if (!session) return;

    const game = lobbyManager.getGame(session.gameId);
    if (!game) return;

    const success = game.selectWildColor(username, color);
    if (success) {
      broadcastGameState(game.gameId);
    } else {
      socket.emit(
        "error-msg",
        "Failed to choose color. Are you the active player?",
      );
    }
  });

  socket.on("draw-card", () => {
    const session = lobbyManager.getSession(socket.id);
    if (!session) return;

    const game = lobbyManager.getGame(session.gameId);
    if (!game) return;

    const drawnCard = game.drawCardAction(username);
    if (drawnCard) {
      broadcastGameState(game.gameId);
    } else {
      socket.emit(
        "error-msg",
        "Cannot draw card. Not your turn or you already drew a card.",
      );
    }
  });

  socket.on("pass-turn", () => {
    const session = lobbyManager.getSession(socket.id);
    if (!session) return;

    const game = lobbyManager.getGame(session.gameId);
    if (!game) return;

    const success = game.passTurn(username);
    if (success) {
      broadcastGameState(game.gameId);
    } else {
      socket.emit(
        "error-msg",
        "Cannot pass turn. Did you draw a card first?",
      );
    }
  });

  socket.on("shout-uno", () => {
    const session = lobbyManager.getSession(socket.id);
    if (!session) return;

    const game = lobbyManager.getGame(session.gameId);
    if (!game) return;

    const success = game.shoutUno(username);
    if (success) {
      broadcastGameState(game.gameId);
    } else {
      socket.emit(
        "error-msg",
        "Cannot shout UNO unless you have exactly 1 card.",
      );
    }
  });

  socket.on(
    "catch-uno",
    ({ targetUsername }: { targetUsername: string }) => {
      const session = lobbyManager.getSession(socket.id);
      if (!session) return;

      const game = lobbyManager.getGame(session.gameId);
      if (!game) return;

      const success = game.catchUnoFailure(
        username,
        targetUsername,
      );
      if (success) {
        broadcastGameState(game.gameId);
      } else {
        socket.emit(
          "error-msg",
          "Cannot catch player. Either they have shouted UNO already, or they have more than 1 card.",
        );
      }
    },
  );

  socket.on("disconnect", () => {
    const session = lobbyManager.removeSocket(socket.id);
    if (session) {
      console.log(
        `[Socket] User ${username} disconnected their ${session.deviceType} from game ${session.gameId}`,
      );

      const game = lobbyManager.getGame(session.gameId);
      if (game) {
        // If all devices of a player are disconnected, let's keep them in the game but broadcast state
        // Let's broadcast state so other players see their status as offline.
        broadcastGameState(game.gameId);

        // If game is in lobby status and everyone is disconnected, delete it
        const allDisconnected = game.players.every(
          (p) => !p.isConnectedPC && !p.isConnectedMobile,
        );
        if (allDisconnected) {
          console.log(
            `[Socket] All players disconnected from game ${game.gameId}. Cleaning up game.`,
          );
          lobbyManager.deleteGame(game.gameId);
        }
      }
    }
  });
});

// Start Server
server.listen(typeof PORT === "string" ? Number.parseInt(PORT) : PORT, "0.0.0.0", () => {
  console.log(`=========================================`);
  console.log(`Uno Backend server listening on:`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(
    `LAN network: http://${getLocalIpAddress()}:${PORT}`,
  );
  console.log(`=========================================`);
});
