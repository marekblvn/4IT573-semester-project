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
} from "../../../backend/src/game/types";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, #10101f 0%, #07070a 100%)",
        "@media (orientation: landscape)": {
          flexDirection: "row",
          gap: 2,
          p: 1.5,
        },
      }}
    >
      {/* Left panel: Info Banner, Turn Indicator & Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          width: "100%",
          "@media (orientation: landscape)": {
            width: "38%",
            height: "100%",
            justifyContent: "space-between",
            gap: 1,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            "@media (orientation: landscape)": {
              gap: 1,
            },
          }}
        >
          {/* Header Info Banner */}
          <Paper
            sx={{
              p: 2,
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              textAlign: "center",
              "@media (orientation: landscape)": {
                p: 1,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                mb: 1,
                "@media (orientation: landscape)": {
                  display: "none",
                },
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

            <Grid container spacing={1} sx={{ mt: 0.5 }}>
              <Grid size={{ xs: 6 }}>
                <Paper
                  sx={{
                    p: 1,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    border: "none",
                    "@media (orientation: landscape)": {
                      p: 0.5,
                    },
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
                    "@media (orientation: landscape)": {
                      p: 0.5,
                    },
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
                      "@media (orientation: landscape)": {
                        fontSize: "1rem",
                        mt: 0.5,
                      },
                    }}
                  >
                    {currentValue}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Turn Indicator */}
          <Box sx={{ textAlign: "center" }}>
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
                  "@media (orientation: landscape)": {
                    py: 0.8,
                    px: 1.5,
                    borderRadius: 2,
                  },
                }}
              >
                <Typography
                  variant="h5"
                  color="secondary.main"
                  sx={{
                    fontWeight: 900,
                    letterSpacing: 0.5,
                    "@media (orientation: landscape)": {
                      fontSize: "1rem",
                    },
                  }}
                >
                  IT'S YOUR TURN!
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    "@media (orientation: landscape)": {
                      fontSize: "0.7rem",
                    },
                  }}
                >
                  Swipe card UP to play it!
                </Typography>
              </Box>
            ) : (
              <Paper
                sx={{
                  py: 1.5,
                  px: 2,
                  background: "rgba(0,0,0,0.2)",
                  border: "none",
                  "@media (orientation: landscape)": {
                    py: 0.8,
                    px: 1.5,
                    borderRadius: 2,
                  },
                }}
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    "@media (orientation: landscape)": {
                      fontSize: "0.85rem",
                    },
                  }}
                >
                  Waiting for turn:{" "}
                  <strong style={{ color: "#fff" }}>
                    {players[turnIndex]?.username}
                  </strong>
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>

        {/* Controller Buttons Area */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            my: 1.5,
            "@media (orientation: landscape)": {
              my: 0,
              mt: "auto",
            },
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
              py: 1.8,
              fontSize: "0.95rem",
              "@media (orientation: landscape)": {
                py: 1.2,
                fontSize: "0.85rem",
              },
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
              py: 1.8,
              fontSize: "0.95rem",
              borderColor: "rgba(255,255,255,0.2)",
              "@media (orientation: landscape)": {
                py: 1.2,
                fontSize: "0.85rem",
              },
            }}
          >
            Pass
          </Button>
        </Stack>
      </Box>

      {/* Right panel: Cards Hand view (Draggable row) */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          "@media (orientation: landscape)": {
            width: "60%",
            height: "100%",
            justifyContent: "space-between",
          },
        }}
      >
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            mb: 1,
            ml: 1,
            fontWeight: 700,
            "@media (orientation: landscape)": {
              mb: 0.5,
            },
          }}
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
            "@media (orientation: landscape)": {
              minHeight: "unset",
              flexGrow: 1,
              py: 1.5,
            },
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
