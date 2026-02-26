import { GameStatus, Rank, Suit } from "./enums";

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
}

export interface Player {
  id: string;
  username: string;
  hand: Card[];
}

export interface GameState {
  roomCode: string;
  status: GameStatus;
  turnIndex: number;
  players: Player[];
  board: Card[];
  deck: Card[];
}
