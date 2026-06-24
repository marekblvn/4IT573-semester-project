import React, {
  useCallback,
  useMemo,
  type JSX,
} from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { CardItem } from "./CardItem";
import {
  type GameState,
  type Player,
} from "../../../backend/src/game/types";
import SignalWifi4BarIcon from "@mui/icons-material/SignalWifi4Bar";
import SignalWifiOffIcon from "@mui/icons-material/SignalWifiOff";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

interface PCViewProps {
  gameState: GameState;
  username: string;
  lanIp: string;
  frontendPort: number;
  token: string;
  onSetReady: (ready: boolean) => void;
  onStartGame: () => void;
  onCatchUno: (targetUsername: string) => void;
  onLeaveGame: () => void;
}

export const PCView: React.FC<PCViewProps> = ({
  gameState,
  username,
  lanIp,
  frontendPort,
  token,
  onSetReady,
  onStartGame,
  onCatchUno,
  onLeaveGame,
}) => {
  const {
    gameId,
    status,
    players,
    discardPile,
    currentColor,
    turnIndex,
    winner,
    log,
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
      status === "playing" &&
      players[turnIndex]?.username.toLowerCase() ===
        username.toLowerCase(),
    [players, status, turnIndex, username],
  );

  // QR Code URL construction
  const mobileUrl = useMemo((): string => {
    // If running locally on localhost, use the detected LAN IP so the phone can connect
    if (
      globalThis.location.hostname === "localhost" ||
      globalThis.location.hostname === "127.0.0.1"
    ) {
      return `http://${lanIp}:${frontendPort}/?gameId=${gameId}&token=${token}&mode=mobile`;
    }
    // If deployed on the web, use the browser's current origin
    return `${globalThis.location.origin}/?gameId=${gameId}&token=${token}&mode=mobile`;
  }, [frontendPort, gameId, lanIp, token]);

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
          return "#9c27b0";
      }
    },
    [],
  );

  const lobbyScreen = useMemo((): JSX.Element => {
    const isCreator =
      !!gameState.creator &&
      gameState.creator.toLowerCase() === username.toLowerCase();
    const canStart =
      isCreator &&
      players.length >= 2 &&
      players.every((p) => p.isReady);
    return (
      <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
        <Grid
          container
          spacing={4}
          sx={{ alignItems: "stretch" }}
        >
          {/* Left Column: Lobby Information */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              sx={{
                p: 4,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800 }}
                >
                  Game Lobby
                </Typography>
                <Chip
                  label={`Room Code: ${gameId}`}
                  color="primary"
                  variant="outlined"
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    px: 1,
                    py: 2,
                    borderRadius: 2,
                  }}
                />
              </Box>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Players Connected ({players.length} / 4):
              </Typography>

              <List sx={{ mb: 4, flexGrow: 1 }}>
                {players.map((player) => (
                  <Paper
                    key={player.username}
                    sx={{
                      mb: 1.5,
                      p: 2,
                      background: "rgba(255,255,255,0.03)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border:
                        player.username.toLowerCase() ===
                        username.toLowerCase()
                          ? "1px solid rgba(156, 39, 176, 0.4)"
                          : "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      {player.isConnectedPC ? (
                        <SignalWifi4BarIcon
                          color="success"
                          fontSize="small"
                          titleAccess="PC Connected"
                        />
                      ) : (
                        <SignalWifiOffIcon
                          color="action"
                          fontSize="small"
                          titleAccess="PC Offline"
                        />
                      )}
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "1.1rem",
                        }}
                      >
                        {player.username}
                        {player.username.toLowerCase() ===
                          username.toLowerCase() &&
                          " (You)"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      {player.isConnectedMobile ? (
                        <Chip
                          size="small"
                          label="Phone Linked"
                          color="info"
                        />
                      ) : (
                        <Chip
                          size="small"
                          label="Phone Offline"
                          variant="outlined"
                        />
                      )}
                      <Chip
                        label={
                          player.isReady
                            ? "Ready"
                            : "Not Ready"
                        }
                        color={
                          player.isReady
                            ? "success"
                            : "warning"
                        }
                      />
                    </Box>
                  </Paper>
                ))}
              </List>

              <Box sx={{ display: "flex", gap: 2 }}>
                {me && (
                  <Button
                    variant="contained"
                    color={
                      me.isReady ? "warning" : "success"
                    }
                    onClick={() => onSetReady(!me.isReady)}
                    sx={{ flexGrow: 1, py: 1.5 }}
                  >
                    {me.isReady
                      ? "Set Not Ready"
                      : "Set Ready"}
                  </Button>
                )}
                {canStart && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onStartGame}
                    sx={{ flexGrow: 1, py: 1.5 }}
                  >
                    Start Game
                  </Button>
                )}
               </Box>
              {!isCreator && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2, textAlign: "center" }}
                >
                  Only the lobby creator (<strong>{gameState.creator}</strong>) can start the game.
                </Typography>
              )}
              {isCreator && !canStart && players.length >= 2 && (
                <Typography
                  variant="body2"
                  color="warning.main"
                  sx={{ mt: 2, textAlign: "center" }}
                >
                  Waiting for all players to click Ready.
                </Typography>
              )}
              {players.length < 2 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2, textAlign: "center" }}
                >
                  Need at least 2 players to start.
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Right Column: QR Code scanning for phone linking */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                height: "100%",
                background:
                  "linear-gradient(135deg, rgba(156, 39, 176, 0.05) 0%, rgba(0, 0, 0, 0) 100%)",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, mb: 1 }}
              >
                Connect Your Phone
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 300 }}
              >
                Scan this QR code with your mobile camera to
                view your hand and play cards by swiping up!
              </Typography>

              <Box
                sx={{
                  p: 3,
                  backgroundColor: "#fff",
                  borderRadius: 4,
                  boxShadow: "0 8px 32px 0 rgba(0,0,0,0.5)",
                  mb: 3,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <QRCodeSVG value={mobileUrl} size={220} />
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  wordBreak: "break-all",
                  maxWidth: 280,
                }}
              >
                Or open on mobile: <br />
                <a
                  href={mobileUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#ff9100",
                    textDecoration: "none",
                  }}
                >
                  {mobileUrl.substring(0, 45)}...
                </a>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }, [
    gameId,
    me,
    mobileUrl,
    onSetReady,
    onStartGame,
    players,
    username,
    gameState,
  ]);

  const endScreen = useMemo((): JSX.Element => {
    return (
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 8,
          textAlign: "center",
        }}
      >
        <Paper
          sx={{
            p: 6,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Confetti decoration */}
          <Box
            sx={{
              position: "absolute",
              top: -50,
              left: "50%",
              transform: "translateX(-50%)",
              width: 200,
              height: 200,
              background:
                "radial-gradient(circle, rgba(255,145,0,0.2) 0%, rgba(0,0,0,0) 70%)",
              pointerEvents: "none",
            }}
          />

          <EmojiEventsIcon
            sx={{ fontSize: 100, color: "#ffaa00", mb: 2 }}
          />

          <Typography
            variant="h3"
            sx={{ fontWeight: 900, mb: 2 }}
          >
            Game Over!
          </Typography>

          {winner ? (
            <Box sx={{ my: 4 }}>
              <Typography
                variant="h5"
                color="text.secondary"
              >
                Winner
              </Typography>
              <Typography
                variant="h2"
                color="primary"
                sx={{ fontWeight: 800, mt: 1 }}
              >
                {winner}
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="h5"
              color="warning.main"
              sx={{ my: 4 }}
            >
              The game ended in a draw or was terminated.
            </Typography>
          )}

          <Divider sx={{ my: 4 }} />

          <Button
            variant="contained"
            color="primary"
            onClick={onLeaveGame}
            sx={{ py: 1.5, px: 4 }}
          >
            Back to Lobby Selection
          </Button>
        </Paper>
      </Box>
    );
  }, [onLeaveGame, winner]);

  // Render Lobby screen
  if (status === "lobby") {
    return lobbyScreen;
  }

  // Render Win / Ended screen
  if (status === "ended") {
    return endScreen;
  }

  // Render Active game table
  const activePlayer = players[turnIndex];
  const topDiscardCard = discardPile.at(-1);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Table & Game State */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            sx={{
              p: 4,
              minHeight: 500,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              background:
                "radial-gradient(circle, rgba(18,18,36,0.9) 0%, rgba(10,10,20,1) 100%)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* Color Indicator Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderRadius: 3,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 800 }}
              >
                Discard Pile Color:
              </Typography>
              <Chip
                label={currentColor.toUpperCase()}
                sx={{
                  backgroundColor:
                    getCardColorValue(currentColor),
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: "1rem",
                  px: 2,
                  py: 2.5,
                  boxShadow: `0 0 15px ${getCardColorValue(currentColor)}88`,
                }}
              />
            </Box>

            {/* Game Table Center (Deck and Discard Card) */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 6,
                my: 6,
              }}
            >
              {/* Deck */}
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 120,
                    height: 180,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #1e1b4b 0%, #311042 100%)",
                    border: "3px solid #fff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      width: "80%",
                      height: "60%",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.05)",
                      transform: "rotate(-20deg)",
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: "#fff", fontWeight: 900 }}
                  >
                    UNO
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      mt: 1,
                    }}
                  >
                    ({gameState.deckCount})
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1.5, fontWeight: 600 }}
                >
                  Draw Pile
                </Typography>
              </Box>

              {/* Top Discard Card */}
              {topDiscardCard ? (
                <Box sx={{ textAlign: "center" }}>
                  <CardItem
                    card={topDiscardCard}
                    playable={false}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1.5, fontWeight: 600 }}
                  >
                    Discard Pile
                  </Typography>
                </Box>
              ) : (
                <Typography>No played cards</Typography>
              )}
            </Box>

            {/* Current Turn & Active Notification */}
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                textAlign: "center",
                background: isMyTurn
                  ? "linear-gradient(45deg, rgba(156, 39, 176, 0.15) 0%, rgba(255, 145, 0, 0.15) 100%)"
                  : "rgba(255,255,255,0.01)",
                border: isMyTurn
                  ? "1px solid rgba(156, 39, 176, 0.3)"
                  : "1px solid rgba(255,255,255,0.03)",
              }}
            >
              {isMyTurn ? (
                <Typography
                  variant="h6"
                  color="primary.light"
                  sx={{ fontWeight: 800 }}
                >
                  🌟 It is your turn! Play from your mobile
                  phone! 🌟
                </Typography>
              ) : (
                <Typography
                  variant="h6"
                  color="text.secondary"
                >
                  Current Turn:{" "}
                  <span
                    style={{
                      color: "#fff",
                      fontWeight: 800,
                    }}
                  >
                    {activePlayer?.username}
                  </span>
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Side Panel: Players List & Log */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Grid container spacing={3}>
            {/* Players Status List */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, mb: 2 }}
                >
                  Players List
                </Typography>
                <List sx={{ p: 0 }}>
                  {players.map((player, idx) => {
                    const isActive = idx === turnIndex;
                    const isTargetUnoshout =
                      gameState.unoShouted[
                        player.username
                      ] === false &&
                      player.hand.length === 1;

                    return (
                      <React.Fragment key={player.username}>
                        {idx > 0 && (
                          <Divider sx={{ my: 1 }} />
                        )}
                        <ListItem
                          secondaryAction={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 800,
                                  ml: 1,
                                }}
                              >
                                {player.hand.length} 🎴
                              </Typography>
                            </Box>
                          }
                          sx={{
                            px: 1,
                            borderRadius: 2,
                            backgroundColor: isActive
                              ? "rgba(156,39,176,0.08)"
                              : "transparent",
                            border: isActive
                              ? "1px solid rgba(156,39,176,0.2)"
                              : "1px solid transparent",
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: isActive
                                      ? 800
                                      : 600,
                                  }}
                                >
                                  {player.username}
                                  {player.username.toLowerCase() ===
                                    username.toLowerCase() &&
                                    " (You)"}
                                </Typography>
                                {player.isConnectedMobile ? (
                                  <SignalWifi4BarIcon
                                    color="info"
                                    sx={{ fontSize: 14 }}
                                    titleAccess="Mobile linked"
                                  />
                                ) : (
                                  <SignalWifiOffIcon
                                    color="action"
                                    sx={{ fontSize: 14 }}
                                    titleAccess="Mobile disconnected"
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              isActive ? (
                                <Typography
                                  variant="caption"
                                  color="primary.light"
                                  sx={{ fontWeight: 700 }}
                                >
                                  Currently Playing
                                </Typography>
                              ) : isTargetUnoshout ? (
                                <Button
                                  variant="outlined"
                                  color="warning"
                                  size="small"
                                  onClick={() =>
                                    onCatchUno(
                                      player.username,
                                    )
                                  }
                                  sx={{
                                    mt: 0.5,
                                    py: 0.2,
                                    px: 1,
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  Catch penalty!
                                </Button>
                              ) : (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Waiting...
                                </Typography>
                              )
                            }
                          />
                        </ListItem>
                      </React.Fragment>
                    );
                  })}
                </List>
              </Paper>
            </Grid>

            {/* Live Log */}
            <Grid size={{ xs: 12 }}>
              <Paper
                sx={{
                  p: 3,
                  height: 280,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, mb: 1 }}
                >
                  Lobby log
                </Typography>
                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: 2,
                    p: 1.5,
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                    lineHeight: 1.4,
                  }}
                >
                  {log && log.length > 0 ? (
                    log.map((line, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: 4,
                          color: "#e0e0e0",
                        }}
                      >
                        {line}
                      </div>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      No logs yet.
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Quick QR link footer on active game */}
            {!me?.isConnectedMobile && (
              <Grid size={{ xs: 12 }}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    background: "rgba(255,145,0,0.05)",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    🔗 Phone not connected?
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      p: 1,
                      backgroundColor: "#fff",
                      borderRadius: 2,
                      width: 100,
                      mx: "auto",
                      mb: 1,
                    }}
                  >
                    <QRCodeSVG
                      value={mobileUrl}
                      size={90}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Scan to view card hand on phone
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
