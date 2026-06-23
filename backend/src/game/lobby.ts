import { UnoGame } from "./uno";

export class LobbyManager {
  private readonly games: Map<string, UnoGame> = new Map();
  // Map of socket.id -> { username, gameId, deviceType: 'pc' | 'mobile' }
  private readonly socketSessions: Map<
    string,
    {
      username: string;
      gameId: string;
      deviceType: "pc" | "mobile";
    }
  > = new Map();

  public createGame(): UnoGame {
    // Generate a simple 5-character alphanumeric room code
    let gameId = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    do {
      gameId = "";
      for (let i = 0; i < 5; i++) {
        gameId += chars.charAt(
          Math.floor(Math.random() * chars.length),
        );
      }
    } while (this.games.has(gameId));

    const game = new UnoGame(gameId);
    this.games.set(gameId, game);
    return game;
  }

  public getGame(gameId: string): UnoGame | undefined {
    return this.games.get(gameId.toUpperCase());
  }

  public getGames(): UnoGame[] {
    return Array.from(this.games.values());
  }

  public deleteGame(gameId: string): void {
    this.games.delete(gameId.toUpperCase());
  }

  public registerSocket(
    socketId: string,
    username: string,
    gameId: string,
    deviceType: "pc" | "mobile",
  ): boolean {
    const game = this.getGame(gameId);
    if (!game) return false;

    // Register details
    this.socketSessions.set(socketId, {
      username,
      gameId: game.gameId,
      deviceType,
    });

    const player = game.getPlayer(username);
    if (player) {
      if (deviceType === "pc") {
        player.isConnectedPC = true;
      } else {
        player.isConnectedMobile = true;
      }
    }

    return true;
  }

  public removeSocket(
    socketId: string,
  ):
    | {
        username: string;
        gameId: string;
        deviceType: "pc" | "mobile";
      }
    | undefined {
    const session = this.socketSessions.get(socketId);
    if (session) {
      this.socketSessions.delete(socketId);
      const game = this.getGame(session.gameId);
      if (game) {
        const player = game.getPlayer(session.username);
        if (player) {
          if (session.deviceType === "pc") {
            player.isConnectedPC = false;
          } else {
            player.isConnectedMobile = false;
          }
        }
      }
    }
    return session;
  }

  public getSession(socketId: string) {
    return this.socketSessions.get(socketId);
  }
}

export const lobbyManager = new LobbyManager();
