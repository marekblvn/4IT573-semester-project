import { Card, GameState } from "../types";

export const drawCards = (state: GameState, count: number): Array<Card> => {
  const drawn: Array<Card> = [];
  for (let i = 0; i < count; i++) {
    if (state.deck.length === 0) {
      const topCard = state.board.pop();

      if (state.board.length > 0) {
        state.deck = [...state.board].reverse();
        state.board = [];
        console.log("Deck recycled from discard pile");
      }

      if (topCard) {
        state.board.push(topCard);
      }
    }

    const card = state.deck.pop();
    if (card) {
      drawn.push(card);
    } else {
      console.log("No more card to draw");
      break;
    }
  }

  return drawn;
};
