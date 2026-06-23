import { db } from "../db";

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

export class UnoGame {
  public gameId: string;
  public status: "lobby" | "playing" | "ended" = "lobby";
  public players: Player[] = [];
  public deck: Card[] = [];
  public discardPile: Card[] = [];
  public currentColor: CardColor = "Wild";
  public currentValue: CardValue = "Wild";
  public turnIndex: number = 0;
  public playDirection: 1 | -1 = 1; // 1 = clockwise, -1 = counter-clockwise
  public winner: string | null = null;
  public hasDrawnThisTurn: boolean = false;
  public unoShouted: Record<string, boolean> = {};
  public wildPendingColorSelectionBy: string | null = null;
  public log: string[] = [];

  constructor(gameId: string) {
    this.gameId = gameId;
  }

  public addPlayer(username: string): boolean {
    if (
      this.players.some(
        (p) =>
          p.username.toLowerCase() ===
          username.toLowerCase(),
      )
    ) {
      return true; // Already joined
    }
    if (this.players.length >= 4) {
      return false; // Full
    }
    if (this.status !== "lobby") {
      return false; // Game already in progress
    }
    this.players.push({
      username,
      hand: [],
      isReady: false,
      isConnectedPC: false,
      isConnectedMobile: false,
    });
    this.unoShouted[username] = false;
    this.addLog(`${username} joined the lobby.`);
    return true;
  }

  public removePlayer(username: string): void {
    const index = this.players.findIndex(
      (p) =>
        p.username.toLowerCase() === username.toLowerCase(),
    );
    if (index !== -1) {
      const p = this.players[index];
      this.players.splice(index, 1);
      delete this.unoShouted[p.username];
      this.addLog(`${p.username} left the lobby.`);

      if (this.status === "playing") {
        if (this.players.length < 2) {
          this.endGame(
            this.players[0]?.username || null,
            "Not enough players remaining.",
          );
        } else {
          // Adjust turnIndex if necessary
          if (this.turnIndex >= this.players.length) {
            this.turnIndex = 0;
          }
          // Return player's hand to deck
          this.deck.push(...p.hand);
          this.shuffleDeck();
        }
      }
    }
  }

  public setReady(username: string, ready: boolean): void {
    const player = this.getPlayer(username);
    if (player && this.status === "lobby") {
      player.isReady = ready;
      this.addLog(
        `${username} is ${ready ? "ready" : "not ready"}.`,
      );
    }
  }

  public canStart(): boolean {
    return (
      this.status === "lobby" &&
      this.players.length >= 2 &&
      this.players.length <= 4 &&
      this.players.every((p) => p.isReady)
    );
  }

  public startGame(): boolean {
    if (!this.canStart()) return false;

    this.status = "playing";
    this.winner = null;
    this.playDirection = 1;
    this.turnIndex = 0;
    this.hasDrawnThisTurn = false;
    this.wildPendingColorSelectionBy = null;
    this.unoShouted = {};

    this.initializeDeck();
    this.shuffleDeck();

    // Deal 7 cards to each player
    for (const player of this.players) {
      player.hand = [];
      this.unoShouted[player.username] = false;
      for (let i = 0; i < 7; i++) {
        const card = this.drawCardFromDeck();
        if (card) player.hand.push(card);
      }
    }

    // Flip the first card to discard pile
    let startingCard = this.drawCardFromDeck();
    while (
      startingCard &&
      (startingCard.color === "Wild" ||
        startingCard.value === "Wild" ||
        startingCard.value === "Wild4")
    ) {
      // If it's a wild card, put it back and reshuffle or pick another card
      this.deck.push(startingCard);
      this.shuffleDeck();
      startingCard = this.drawCardFromDeck();
    }

    if (startingCard) {
      this.discardPile.push(startingCard);
      this.currentColor = startingCard.color;
      this.currentValue = startingCard.value;
      this.addLog(
        `Game started! First card is ${startingCard.color} ${startingCard.value}.`,
      );

      // Apply initial card effects if any
      this.applyStartingCardEffect(startingCard);
    }

    return true;
  }

  private applyStartingCardEffect(card: Card) {
    const activePlayer = this.players[this.turnIndex];
    if (card.value === "Skip") {
      this.addLog(
        `${activePlayer.username}'s turn was skipped by the starting Skip card!`,
      );
      this.advanceTurn();
    } else if (card.value === "Reverse") {
      this.playDirection = -1;
      this.turnIndex = this.players.length - 1; // Reverse direction means player 0 is skipped or we start from the last player
      this.addLog(
        `Play direction reversed by starting Reverse card!`,
      );
    } else if (card.value === "Draw2") {
      this.addLog(
        `${activePlayer.username} must draw 2 cards and skip their turn!`,
      );
      this.playerDrawCards(activePlayer.username, 2, false); // Draw cards
      this.advanceTurn();
    }
  }

  private initializeDeck(): void {
    this.deck = [];
    const colors: CardColor[] = [
      "Red",
      "Blue",
      "Yellow",
      "Green",
    ];
    let cardIdCount = 0;

    const createCard = (
      color: CardColor,
      value: CardValue,
    ): Card => ({
      id: `card_${cardIdCount++}`,
      color,
      value,
    });

    for (const color of colors) {
      // One '0' card
      this.deck.push(createCard(color, "0"));

      // Two of each '1'-'9' cards
      for (let i = 1; i <= 9; i++) {
        this.deck.push(
          createCard(color, i.toString() as CardValue),
          createCard(color, i.toString() as CardValue),
        );
      }

      // Two of each action card
      for (const action of [
        "Skip",
        "Reverse",
        "Draw2",
      ] as CardValue[]) {
        this.deck.push(createCard(color, action), createCard(color, action));
      }
    }

    // Four of each wild card
    for (let i = 0; i < 4; i++) {
      this.deck.push(createCard("Wild", "Wild"), createCard("Wild", "Wild4"));
    }
  }

  private shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [
        this.deck[j],
        this.deck[i],
      ];
    }
  }

  private drawCardFromDeck(): Card | null {
    if (this.deck.length === 0) {
      // Recycle discard pile (except top card)
      if (this.discardPile.length <= 1) {
        return null; // Out of cards completely
      }
      const topCard = this.discardPile.pop()!;
      this.deck = [...this.discardPile];
      this.discardPile = [topCard];
      this.shuffleDeck();
      this.addLog(`Reshuffled discard pile into deck.`);
    }
    return this.deck.pop() || null;
  }

  public getPlayer(username: string): Player | undefined {
    return this.players.find(
      (p) =>
        p.username.toLowerCase() === username.toLowerCase(),
    );
  }

  public getActivePlayer(): Player {
    return this.players[this.turnIndex];
  }

  public isPlayerTurn(username: string): boolean {
    if (this.status !== "playing") return false;
    if (this.wildPendingColorSelectionBy) {
      return (
        this.wildPendingColorSelectionBy.toLowerCase() ===
        username.toLowerCase()
      );
    }
    return (
      this.getActivePlayer().username.toLowerCase() ===
      username.toLowerCase()
    );
  }

  public canPlayCard(
    username: string,
    cardId: string,
  ): boolean {
    if (!this.isPlayerTurn(username)) return false;
    if (this.wildPendingColorSelectionBy) return false; // Waiting for color selection

    const player = this.getPlayer(username);
    if (!player) return false;

    const card = player.hand.find((c) => c.id === cardId);
    if (!card) return false;

    // Wild cards can always be played
    if (card.color === "Wild") return true;

    // Match color or value
    return (
      card.color === this.currentColor ||
      card.value === this.currentValue
    );
  }

  public playCard(
    username: string,
    cardId: string,
  ): boolean {
    if (!this.canPlayCard(username, cardId)) return false;

    const player = this.getPlayer(username);
    if (!player) return false;

    const cardIndex = player.hand.findIndex(
      (c) => c.id === cardId,
    );
    const card = player.hand[cardIndex];

    // Remove from player hand and add to discard pile
    player.hand.splice(cardIndex, 1);
    this.discardPile.push(card);

    this.currentColor = card.color;
    this.currentValue = card.value;

    this.addLog(
      `${username} played ${card.color === "Wild" ? "" : card.color + " "}${card.value}.`,
    );

    // Reset drawn flag for this turn
    this.hasDrawnThisTurn = false;

    // Handle "Uno!" shout checks
    if (player.hand.length === 1) {
      // Mark as not shouted yet. Player has a short window or must click "UNO" on their turn.
      // If they don't shout before the next player starts their turn, someone can call them out.
      this.unoShouted[player.username] = false;
    } else {
      delete this.unoShouted[player.username];
    }

    // Handle Wild color selection
    if (card.color === "Wild") {
      this.wildPendingColorSelectionBy = player.username;
      // We wait for the client to emit "selectColor"
      return true;
    }

    // Apply normal action cards
    this.resolveCardAction(card);

    return true;
  }

  public selectWildColor(
    username: string,
    color: CardColor,
  ): boolean {
    if (this.status !== "playing") return false;
    if (this.wildPendingColorSelectionBy !== username)
      return false;

    if (
      !["Red", "Blue", "Yellow", "Green"].includes(color)
    ) {
      return false; // Invalid color
    }

    this.currentColor = color;
    this.wildPendingColorSelectionBy = null;
    this.addLog(`${username} chose color ${color}.`);

    // If it was a Wild Draw 4, apply the action to the next player
    const topCard =
      this.discardPile.at(-1);
    if (topCard?.value === "Wild4") {
      const nextPlayerIndex = this.getNextPlayerIndex();
      const nextPlayer = this.players[nextPlayerIndex];
      this.addLog(
        `${nextPlayer.username} must draw 4 cards and skip their turn!`,
      );
      this.playerDrawCards(nextPlayer.username, 4, false);
      this.advanceTurn(); // Skip their turn
    }

    // Check for win condition after wild play
    if (this.checkWinCondition(username)) return true;

    this.advanceTurn();
    return true;
  }

  private resolveCardAction(card: Card) {
    if (
      this.checkWinCondition(
        this.getActivePlayer().username,
      )
    )
      return;

    if (card.value === "Skip") {
      const nextPlayer =
        this.players[this.getNextPlayerIndex()];
      this.addLog(
        `${nextPlayer.username}'s turn was skipped!`,
      );
      this.advanceTurn(); // Skip turn (advance once more)
      this.advanceTurn();
    } else if (card.value === "Reverse") {
      if (this.players.length === 2) {
        // In 2 player game, Reverse behaves like Skip
        const nextPlayer =
          this.players[this.getNextPlayerIndex()];
        this.addLog(
          `${nextPlayer.username}'s turn was skipped!`,
        );
        this.advanceTurn();
        this.advanceTurn();
      } else {
        this.playDirection = (this.playDirection * -1) as
          | 1
          | -1;
        this.addLog(
          `Play direction is now ${this.playDirection === 1 ? "clockwise" : "counter-clockwise"}.`,
        );
        this.advanceTurn();
      }
    } else if (card.value === "Draw2") {
      const nextPlayerIndex = this.getNextPlayerIndex();
      const nextPlayer = this.players[nextPlayerIndex];
      this.addLog(
        `${nextPlayer.username} must draw 2 cards and skip their turn!`,
      );
      this.playerDrawCards(nextPlayer.username, 2, false);
      this.advanceTurn(); // Skip their turn
      this.advanceTurn();
    } else {
      // Normal card
      this.advanceTurn();
    }
  }

  public drawCardAction(username: string): Card | null {
    if (!this.isPlayerTurn(username)) return null;
    if (this.wildPendingColorSelectionBy) return null;
    if (this.hasDrawnThisTurn) return null; // Can only draw once per turn

    const player = this.getPlayer(username);
    if (!player) return null;

    const card = this.drawCardFromDeck();
    if (!card) return null;

    player.hand.push(card);
    this.hasDrawnThisTurn = true;
    this.addLog(`${username} drew a card.`);

    // If the drawn card is playable, we let the client decide to play it or pass.
    // So we don't automatically end the turn here.
    return card;
  }

  public passTurn(username: string): boolean {
    if (!this.isPlayerTurn(username)) return false;
    if (this.wildPendingColorSelectionBy) return false;
    if (!this.hasDrawnThisTurn) return false; // Must draw before passing

    this.addLog(`${username} passed.`);
    this.hasDrawnThisTurn = false;
    this.advanceTurn();
    return true;
  }

  public shoutUno(username: string): boolean {
    const player = this.getPlayer(username);
    if (player?.hand.length !== 1) {
      return false; // Can only shout UNO when you have exactly 1 card
    }

    this.unoShouted[username] = true;
    this.addLog(`${username} shouted UNO!`);
    return true;
  }

  // Catch a player who has 1 card but didn't shout UNO before next turn starts
  public catchUnoFailure(
    catcherUsername: string,
    targetUsername: string,
  ): boolean {
    if (this.status !== "playing") return false;

    const target = this.getPlayer(targetUsername);
    if (!target) return false;

    // Check if they have 1 card and haven't shouted UNO
    if (
      target.hand.length === 1 &&
      !this.unoShouted[target.username]
    ) {
      this.addLog(
        `${catcherUsername} caught ${targetUsername} neglecting to shout UNO!`,
      );
      this.addLog(
        `${targetUsername} draws 2 cards as a penalty.`,
      );
      this.playerDrawCards(targetUsername, 2, false);
      // Once caught, they don't get caught again for the same card
      this.unoShouted[target.username] = true;
      return true;
    }

    return false;
  }

  private playerDrawCards(
    username: string,
    count: number,
    logIt: boolean = true,
  ) {
    const player = this.getPlayer(username);
    if (!player) return;

    for (let i = 0; i < count; i++) {
      const card = this.drawCardFromDeck();
      if (card) {
        player.hand.push(card);
      }
    }
    if (logIt) {
      this.addLog(`${username} drew ${count} cards.`);
    }
  }

  private getNextPlayerIndex(): number {
    let nextIndex = this.turnIndex + this.playDirection;
    if (nextIndex >= this.players.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = this.players.length - 1;
    return nextIndex;
  }

  private advanceTurn() {
    this.turnIndex = this.getNextPlayerIndex();
    this.hasDrawnThisTurn = false;
  }

  private checkWinCondition(username: string): boolean {
    const player = this.getPlayer(username);
    if (player?.hand.length === 0) {
      this.endGame(username);
      return true;
    }
    return false;
  }

  private endGame(
    winnerUsername: string | null,
    reason?: string,
  ) {
    this.status = "ended";
    this.winner = winnerUsername;
    if (winnerUsername) {
      this.addLog(
        `Game ended! Winner is ${winnerUsername}!`,
      );
      // Update database statistics
      for (const player of this.players) {
        db.incrementUserStats(
          player.username,
          player.username === winnerUsername,
        );
      }
    } else {
      this.addLog(`Game ended. ${reason || ""}`);
    }
  }

  private addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.log.push(`[${timestamp}] ${message}`);
    // Limit log size to last 50 entries
    if (this.log.length > 50) {
      this.log.shift();
    }
  }

  public getGameState(playerUsername?: string): GameState {
    return {
      gameId: this.gameId,
      status: this.status,
      // For privacy, obscure hand cards of OTHER players
      players: this.players.map((p) => {
        const isCurrentRequester =
          p.username.toLowerCase() === playerUsername?.toLowerCase();
        return {
          username: p.username,
          isReady: p.isReady,
          isConnectedPC: p.isConnectedPC,
          isConnectedMobile: p.isConnectedMobile,
          // If playing, only show hand to the owner. Show card counts to others.
          hand:
            this.status === "playing" && !isCurrentRequester
              ? new Array(p.hand.length).fill({
                  id: "",
                  color: "Wild",
                  value: "Wild",
                }) // Placeholder cards
              : p.hand,
        };
      }),
      discardPile: this.discardPile,
      currentColor: this.currentColor,
      currentValue: this.currentValue,
      turnIndex: this.turnIndex,
      playDirection: this.playDirection,
      winner: this.winner,
      hasDrawnThisTurn: this.hasDrawnThisTurn,
      unoShouted: this.unoShouted,
      wildPendingColorSelectionBy:
        this.wildPendingColorSelectionBy,
      deckCount: this.deck.length,
      log: this.log,
    };
  }
}
