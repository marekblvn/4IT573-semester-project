import { RedisClientType } from "redis";
import { Server, Socket } from "socket.io";
import { GameState } from "../types";
import { canPlayCard } from "../utils/card-matching";
import { GameStatus } from "../enums";
import { createDeck } from "../utils/deck";
import { drawCards } from "../game-logic";

type PlayCardParams = {
  roomId: string;
  cardId: string;
};

export default (io: Server, socket: Socket, pubClient: RedisClientType) => {
  const start = async ({ roomId }: { roomId: string }) => {
    const stateRaw = await pubClient.get(`game:${roomId}`);
    if (!stateRaw) return;
    let state: GameState = JSON.parse(stateRaw);

    if (state.players.length < 2) {
      return socket.emit("room:error", "Need at least 2 players to start");
    }

    state.status = GameStatus.PLAYING;
    state.deck = createDeck();

    state.players.forEach((p) => {
      p.hand = state.deck.splice(0, 5);
    });

    state.board = [state.deck.pop()!];

    await pubClient.set(`game:${roomId}`, JSON.stringify(state), { EX: 3600 });
    io.to(roomId).emit("room:update", state);
  };

  const draw = async ({
    roomId,
    count = 1,
  }: {
    roomId: string;
    count?: number;
  }) => {
    const stateRaw = await pubClient.get(`game:${roomId}`);
    if (!stateRaw) return;
    const state: GameState = JSON.parse(stateRaw);

    const player = state.players[state.turnIndex];
    if (player.id !== socket.id)
      return socket.emit("game:error", "Not your turn");

    const cards = drawCards(state, count);

    if (cards.length > 0) {
      player.hand.push(...cards);
      state.turnIndex = (state.turnIndex + 1) % state.players.length;
      await pubClient.set(`game:${roomId}`, JSON.stringify(state), {
        EX: 3600,
      });
      io.to(roomId).emit("room:update", state);
    } else {
      socket.emit("game:error", "No cards left in the game");
    }
  };

  const playCard = async ({ roomId, cardId }: PlayCardParams) => {
    const stateRaw = await pubClient.get(`game:${roomId}`);
    if (!stateRaw) return;
    let state: GameState = JSON.parse(stateRaw);

    const currentPlayer = state.players[state.turnIndex];
    if (currentPlayer.id !== socket.id)
      return socket.emit("game:error", "Not your turn");

    const cardIdx = currentPlayer.hand.findIndex((c) => c.id === cardId);
    if (cardIdx === -1) return;
    const playedCard = currentPlayer.hand[cardIdx];
    const topCard = state.board[state.board.length - 1];

    if (!canPlayCard(playedCard, topCard)) {
      return socket.emit("game:error", "Invalid move");
    }

    currentPlayer.hand.splice(cardIdx, 1);
    state.board.push(playedCard);
    state.turnIndex = (state.turnIndex + 1) % state.players.length;

    await pubClient.set(`game:${roomId}`, JSON.stringify(state), {
      EX: 3600,
    });
    io.to(roomId).emit("room:update", state);
  };

  socket.on("game:start", start);
  socket.on("game:draw", draw);
  socket.on("game:play-card", playCard);
};
