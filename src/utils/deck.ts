import { Rank, Suit } from "../enums";
import { Card } from "../types";

export const createDeck = (): Array<Card> => {
  const deck: Array<Card> = [];
  for (let s = 1; s <= 4; s++) {
    for (let r = 1; r <= 8; r++) {
      deck.push({
        suit: s as Suit,
        rank: r as Rank,
        id: `${s}-${r}`,
      });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};
