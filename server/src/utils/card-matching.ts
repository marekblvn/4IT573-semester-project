import { Card } from "../types";

export const canPlayCard = (playedCard: Card, topCard: Card) =>
  playedCard.suit === topCard.suit || playedCard.rank === topCard.rank;
