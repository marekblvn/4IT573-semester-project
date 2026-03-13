export enum Suit {
  Hearts = 1, // Červené / Srdce
  Spades, // Listy / Zelené / Píky
  Diamonds, // Káry / Kule
  Clubs, // Žaludy
}

export enum Rank {
  SEVEN = 1,
  EIGHT,
  NINE,
  TEN,
  JACK, // Spodek
  QUEEN, // Svršek
  KING,
  ACE,
}

export enum GameStatus {
  LOBBY = "LOBBY",
  PLAYING = "PLAYING",
  GAME_OVER = "GAME_OVER",
}
