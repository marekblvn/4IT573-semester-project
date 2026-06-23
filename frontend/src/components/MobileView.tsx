import React, { useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
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
} from "../../../backend/src/game/uno";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

interface MobileViewProps {
  gameState: GameState;
  username: string;
  onPlayCard: (cardId: string) => void;
  onDrawCard: () => void;
  onPassTurn: () => void;
  onShoutUno: () => void;
  onSelectColor: (color: CardColor) => void;
}

export const MobileView: React.FC<MobileViewProps> = ({
  gameState,
  username,
  onPlayCard,
  onDrawCard,
  onPassTurn,
  onShoutUno,
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
        height: "92vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, #10101f 0%, #07070a 100%)",
      }}
    >
      {/* Header Info Banner */}
      <Paper
        sx={{
          p: 2,
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          textAlign: "center",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <SportsEsportsIcon color="secondary" />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800, letterSpacing: 1 }}
          >
            UNO! CONTROLLER
          </Typography>
        </Box>

        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid size={{ xs: 6 }}>
            <Paper
              sx={{
                p: 1,
                backgroundColor: "rgba(0,0,0,0.3)",
                border: "none",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                CURRENT COLOR
              </Typography>
              <Box
                sx={{
                  mt: 0.5,
                  height: 28,
                  borderRadius: 1.5,
                  backgroundColor:
                    getCardColorValue(currentColor),
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: `0 0 10px ${getCardColorValue(currentColor)}88`,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 900,
                    color: "#fff",
                    fontSize: "0.85rem",
                  }}
                >
                  {currentColor.toUpperCase()}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Paper
              sx={{
                p: 1,
                backgroundColor: "rgba(0,0,0,0.3)",
                border: "none",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                TOP CARD VALUE
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.2,
                  mt: 0.2,
                }}
              >
                {currentValue}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Turn Indicator */}
      <Box sx={{ my: 1, textAlign: "center" }}>
        {isMyTurn ? (
          <Box
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: 3,
              background:
                "linear-gradient(45deg, rgba(255,145,0,0.2) 0%, rgba(156,39,176,0.2) 100%)",
              border: "1px solid rgba(255,145,0,0.4)",
              animation: "pulse 1.5s infinite ease-in-out",
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)" },
                "50%": {
                  transform: "scale(1.03)",
                  boxShadow: "0 0 15px rgba(255,145,0,0.3)",
                },
              },
            }}
          >
            <Typography
              variant="h5"
              color="secondary.main"
              sx={{ fontWeight: 900, letterSpacing: 0.5 }}
            >
              👉 IT'S YOUR TURN! 👈
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Swipe card UP to the top edge to play it!
            </Typography>
          </Box>
        ) : (
          <Paper
            sx={{
              py: 1.5,
              px: 2,
              background: "rgba(0,0,0,0.2)",
              border: "none",
            }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
            >
              Waiting for turn:{" "}
              <strong style={{ color: "#fff" }}>
                {players[turnIndex]?.username}
              </strong>
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Cards Hand view (Draggable row) */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          my: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mb: 1, ml: 1, fontWeight: 700 }}
        >
          YOUR HAND ({me ? me.hand.length : 0} cards)
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            overflowX: "auto",
            py: 3,
            px: 2,
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: 4,
            minHeight: 200,
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
          {me && me.hand.length > 0 ? (
            me.hand.map((card) => (
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

      {/* Controller Buttons Area */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
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
          sx={{ py: 1.8, fontSize: "0.95rem" }}
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
            py: 1.8,
            fontSize: "0.95rem",
            borderColor: "rgba(255,255,255,0.2)",
          }}
        >
          Pass
        </Button>
      </Stack>

      {/* Shout UNO button */}
      <Button
        fullWidth
        variant="contained"
        color="warning"
        disabled={!me || me.hand.length > 2} // Available if they have 2 cards (about to play 1) or 1 card
        onClick={onShoutUno}
        sx={{
          py: 1.8,
          fontSize: "1rem",
          fontWeight: 900,
          background:
            "linear-gradient(45deg, #ff9100 0%, #ff5555 100%)",
          boxShadow: "0 0 15px rgba(255, 85, 85, 0.4)",
        }}
      >
        📢 SHOUT UNO! 📢
      </Button>

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
