import React, { useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
} from "@mui/material";
import { CardItem, type CardData } from "./CardItem";
import {
  type GameState,
  type CardColor,
  type Player,
} from "../../../backend/src/game/types";

interface MobileViewProps {
  gameState: GameState;
  username: string;
  onPlayCard: (cardId: string) => void;
  onDrawCard: () => void;
  onPassTurn: () => void;
  onSelectColor: (color: CardColor) => void;
}

export const MobileView: React.FC<MobileViewProps> = ({
  gameState,
  username,
  onPlayCard,
  onDrawCard,
  onPassTurn,
  onSelectColor,
}) => {
  const {
    players,
    currentColor,
    currentValue,
    turnIndex,
    wildPendingColorSelectionBy,
    hasDrawnThisTurn,
  } = gameState;

  // Find the player object for the current logged-in user
  const me = useMemo(
    (): Player | undefined =>
      players.find(
        (p) =>
          p.username.toLowerCase() ===
          username.toLowerCase(),
      ),
    [players, username],
  );
  const isMyTurn = useMemo(
    (): boolean =>
      gameState.status === "playing" &&
      players[turnIndex]?.username.toLowerCase() ===
        username.toLowerCase(),
    [gameState.status, players, turnIndex, username],
  );

  // If wild pending selection is active for me
  const isWildSelectionPendingForMe = useMemo(
    (): boolean =>
      wildPendingColorSelectionBy?.toLowerCase() ===
      username.toLowerCase(),
    [username, wildPendingColorSelectionBy],
  );

  // Calculate if a card is playable
  const isCardPlayable = useCallback(
    (card: CardData): boolean => {
      if (!isMyTurn) return false;
      if (wildPendingColorSelectionBy) return false; // Waiting for color selection
      if (card.color === "Wild") return true;
      return (
        card.color === currentColor ||
        card.value === currentValue
      );
    },
    [
      currentColor,
      currentValue,
      isMyTurn,
      wildPendingColorSelectionBy,
    ],
  );

  // Sort hand so playable cards are at the beginning
  const sortedHand = useMemo(() => {
    if (!me?.hand) return [];
    const handCopy = [...me.hand];
    return handCopy.sort((a, b) => {
      const aPlayable = isCardPlayable(a);
      const bPlayable = isCardPlayable(b);
      if (aPlayable && !bPlayable) return -1;
      if (!aPlayable && bPlayable) return 1;
      return 0;
    });
  }, [me, isCardPlayable]);

  const getCardColorValue = useCallback(
    (color: string): string => {
      switch (color) {
        case "Red":
          return "#ff5555";
        case "Blue":
          return "#2f80ed";
        case "Yellow":
          return "#f2c94c";
        case "Green":
          return "#27ae60";
        default:
          return "#222";
      }
    },
    [],
  );

  const handlePlayCard = useCallback(
    (cardId: string): void => {
      onPlayCard(cardId);
    },
    [onPlayCard],
  );

  return (
    <Box
      sx={{
        p: 2,
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, #10101f 0%, #07070a 100%)",
      }}
    >
      {/* Top: Cards Hand view (Draggable row) */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            mb: 1.5,
            fontWeight: 900,
            letterSpacing: 0.5,
            color: isMyTurn ? "secondary.main" : "text.secondary",
            animation: isMyTurn ? "pulse 1.5s infinite ease-in-out" : "none",
            "@keyframes pulse": {
              "0%, 100%": { opacity: 0.8 },
              "50%": { opacity: 1, textShadow: "0 0 8px rgba(156,39,176,0.6)" },
            },
          }}
        >
          {isMyTurn ? "👉 YOUR TURN - SWIPE CARD UP TO PLAY 👈" : `YOUR HAND (${me ? me.hand.length : 0} cards)`}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            overflowX: "auto",
            py: 2.5,
            px: 2,
            backgroundColor: "rgba(0,0,0,0.25)",
            borderRadius: 4,
            minHeight: 180,
            flexGrow: 1,
            /* Hide scrollbar for Chrome, Safari and Opera */
            "&::-webkit-scrollbar": {
              height: 6,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 3,
            },
          }}
        >
          {me && sortedHand.length > 0 ? (
            sortedHand.map((card) => (
              <Box key={card.id} sx={{ flexShrink: 0 }}>
                <CardItem
                  card={card}
                  playable={isCardPlayable(card)}
                  onPlay={handlePlayCard}
                  isMobile={true}
                />
              </Box>
            ))
          ) : (
            <Box
              sx={{
                m: "auto",
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="body1">
                No cards in your hand.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Bottom: Controller Buttons Area */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          mt: 2,
          mb: 1,
        }}
      >
        {/* Draw Card button */}
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          disabled={
            !isMyTurn ||
            hasDrawnThisTurn ||
            isWildSelectionPendingForMe
          }
          onClick={onDrawCard}
          sx={{
            py: 1.5,
            fontSize: "0.95rem",
            fontWeight: 800,
          }}
        >
          Draw Card
        </Button>

        {/* Pass button */}
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          disabled={
            !isMyTurn ||
            !hasDrawnThisTurn ||
            isWildSelectionPendingForMe
          }
          onClick={onPassTurn}
          sx={{
            py: 1.5,
            fontSize: "0.95rem",
            fontWeight: 800,
            borderColor: "rgba(255,255,255,0.2)",
          }}
        >
          Pass
        </Button>
      </Stack>

      {/* Wild Color Selection Modal */}
      <Dialog
        open={isWildSelectionPendingForMe}
        slotProps={{
          paper: {
            sx: {
              background: "#121224",
              border: "2px solid rgba(255,255,255,0.1)",
              borderRadius: 4,
              p: 2,
            },
          },
        }}
      >
        <DialogTitle
          sx={{ textAlign: "center", fontWeight: 900 }}
        >
          Choose Wild Color
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 3 }}
          >
            Select the new color for the discard pile:
          </Typography>
          <Grid container spacing={2}>
            {(
              [
                "Red",
                "Blue",
                "Yellow",
                "Green",
              ] as CardColor[]
            ).map((color) => (
              <Grid size={{ xs: 6 }} key={color}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => onSelectColor(color)}
                  sx={{
                    py: 3,
                    fontSize: "1.1rem",
                    fontWeight: 900,
                    backgroundColor:
                      getCardColorValue(color),
                    color: "#fff",
                    boxShadow: `0 4px 10px ${getCardColorValue(color)}44`,
                    "&:hover": {
                      backgroundColor:
                        getCardColorValue(color),
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {color}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
