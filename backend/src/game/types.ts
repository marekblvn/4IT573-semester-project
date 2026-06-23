export type CardColor =
  | "Red"
  | "Blue"
  | "Yellow"
  | "Green"
  | "Wild";

export type CardValue =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "Skip"
  | "Reverse"
  | "Draw2"
  | "Wild"
  | "Wild4";

export interface Card {
  id: string;
  color: CardColor;
  value: CardValue;
}

export interface Player {
  username: string;
  hand: Card[];
  isReady: boolean;
  isConnectedPC: boolean;
  isConnectedMobile: boolean;
}

export interface GameState {
  gameId: string;
  status: "lobby" | "playing" | "ended";
  players: Player[];
  discardPile: Card[];
  currentColor: CardColor;
  currentValue: CardValue;
  turnIndex: number;
  playDirection: 1 | -1;
  winner: string | null;
  hasDrawnThisTurn: boolean;
  unoShouted: Record<string, boolean>; // Maps username -> boolean
  wildPendingColorSelectionBy: string | null; // Username of player who needs to select wild color
  deckCount: number;
  log: string[];
}
