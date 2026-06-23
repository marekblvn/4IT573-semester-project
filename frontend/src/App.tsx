import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  List,
  ListItemText,
  Alert,
  Snackbar,
  Divider,
} from "@mui/material";
import { theme } from "./theme";
import { AuthScreen } from "./components/AuthScreen";
import { PCView } from "./components/PCView";
import { MobileView } from "./components/MobileView";
import { io, Socket } from "socket.io-client";
import {
  type GameState,
  type CardColor,
} from "../../backend/src/game/types";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AddBoxIcon from "@mui/icons-material/AddBox";

export default function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username"),
  );
  const [mode, setMode] = useState<"pc" | "mobile">("pc");
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameState, setGameState] =
    useState<GameState | null>(null);
  const [activeLobbies, setActiveLobbies] = useState<
    {
      gameId: string;
      status: string;
      playerCount: number;
    }[]
  >([]);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [networkInfo, setNetworkInfo] = useState({
    localIp: "localhost",
    port: 5001,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(
    null,
  );
  const [showError, setShowError] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  const apiHost = globalThis.location.hostname;
  const apiBaseUrl = `http://${apiHost}:5001`;
  const wsBaseUrl = `http://${apiHost}:5001`;

  const fetchLobbies = useCallback(async () => {
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/lobby/list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setActiveLobbies(data);
      }
    } catch (err) {
      console.error("Failed to fetch lobbies:", err);
    }
  }, [apiBaseUrl, token]);

  const handleAuthSuccess = (
    newToken: string,
    newUsername: string,
  ) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    setToken(newToken);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
    setGameId(null);
    setGameState(null);
    setMode("pc");
    // Clear URL query parameters
    globalThis.history.pushState(
      {},
      "",
      globalThis.location.pathname,
    );
  };

  const handleCreateLobby = async () => {
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/lobby/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (res.ok) {
        setGameId(data.gameId);
      } else {
        throw new Error(data.error);
      }
    } catch (err: unknown) {
      setErrorMsg(
        (err as Error).message ||
          "Failed to create game lobby",
      );
      setShowError(true);
    }
  };

  const handleJoinLobby = async (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;

    try {
      const res = await fetch(
        `${apiBaseUrl}/api/lobby/check/${cleanCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (res.ok) {
        setGameId(data.gameId);
      } else {
        throw new Error(data.error || "Room not found");
      }
    } catch (err: unknown) {
      setErrorMsg(
        (err as Error).message ||
          "Failed to join game lobby",
      );
      setShowError(true);
    }
  };

  const handleLeaveGame = () => {
    setGameId(null);
    setGameState(null);
    // Clear search parameters from URL
    globalThis.history.pushState(
      {},
      "",
      globalThis.location.pathname,
    );
  };

  // Socket action triggers
  const handlePlayCard = (cardId: string) => {
    socketRef.current?.emit("play-card", { cardId });
  };

  const handleDrawCard = () => {
    socketRef.current?.emit("draw-card");
  };

  const handlePassTurn = () => {
    socketRef.current?.emit("pass-turn");
  };

  const handleShoutUno = () => {
    socketRef.current?.emit("shout-uno");
  };

  const handleSelectColor = (color: CardColor) => {
    socketRef.current?.emit("select-color", { color });
  };

  const handleSetReady = (ready: boolean) => {
    socketRef.current?.emit("set-ready", { ready });
  };

  const handleStartGame = () => {
    socketRef.current?.emit("start-game");
  };

  const handleCatchUno = (target: string) => {
    socketRef.current?.emit("catch-uno", {
      targetUsername: target,
    });
  };

  // Parse URL Search Parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(
      globalThis.location.search,
    );
    const paramToken = params.get("token");
    const paramGameId = params.get("gameId");
    const paramMode = params.get("mode");

    if (paramToken) {
      localStorage.setItem("token", paramToken);
      setToken(paramToken);
    }
    if (paramGameId) {
      setGameId(paramGameId.toUpperCase());
    }
    if (paramMode === "mobile") {
      setMode("mobile");
    }
  }, []);

  // Fetch Network Info from Backend (to build dynamic mobile connection URL)
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/network-info`)
      .then((res) => res.json())
      .then((data) => {
        setNetworkInfo(data);
      })
      .catch((err) => {
        console.error("Error fetching network info:", err);
      });
  }, [apiBaseUrl]);

  // Fetch user profile if token is present but username is not
  useEffect(() => {
    if (token && !username) {
      fetch(`${apiBaseUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Token expired");
          return res.json();
        })
        .then((data) => {
          localStorage.setItem("username", data.username);
          setUsername(data.username);
        })
        .catch(() => {
          // Token expired or invalid
          handleLogout();
        });
    }
  }, [token, username, apiBaseUrl]);

  // Fetch active lobbies when in PC mode and not in a game
  useEffect(() => {
    if (token && mode === "pc" && !gameId) {
      fetchLobbies();
      const interval = setInterval(fetchLobbies, 5000);
      return () => clearInterval(interval);
    }
  }, [token, mode, gameId, fetchLobbies]);

  // Setup WebSocket connection when in a game room
  useEffect(() => {
    if (token && gameId) {
      // Connect socket
      const socket = io(wsBaseUrl, {
        auth: { token },
        query: { token },
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Connected to socket server");
        socket.emit("join-game", {
          gameId,
          deviceType: mode,
        });
      });

      socket.on("game-state", (state: GameState) => {
        setGameState(state);
      });

      socket.on("error-msg", (msg: string) => {
        setErrorMsg(msg);
        setShowError(true);
      });

      socket.on("connect_error", (err) => {
        setErrorMsg(`Connection error: ${err.message}`);
        setShowError(true);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });

      return () => {
        socket.disconnect();
        socketRef.current = null;
        setGameState(null);
      };
    }
  }, [token, gameId, mode, wsBaseUrl]);

  // 1. Not Authenticated Screen
  if (!token || !username) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container sx={{ mt: 8 }}>
          <AuthScreen
            apiBaseUrl={apiBaseUrl}
            onAuthSuccess={handleAuthSuccess}
          />
        </Container>
      </ThemeProvider>
    );
  }

  // 2. Mobile Hand Screen (Companion View)
  if (mode === "mobile") {
    if (!gameId) {
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              p: 4,
              height: "90vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, mb: 2 }}
              >
                Join Game Room
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Enter the room code displayed on the PC
                screen to play!
              </Typography>
              <TextField
                fullWidth
                label="Room Code"
                variant="outlined"
                value={joinCodeInput}
                onChange={(e) =>
                  setJoinCodeInput(e.target.value)
                }
                sx={{ mb: 3 }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={() =>
                  handleJoinLobby(joinCodeInput)
                }
                sx={{ py: 1.5 }}
              >
                Connect to Game
              </Button>
              <Button
                fullWidth
                variant="text"
                color="secondary"
                onClick={() => setMode("pc")}
                sx={{ mt: 2 }}
              >
                Switch to PC Mode
              </Button>
            </Paper>
          </Box>
        </ThemeProvider>
      );
    }

    if (!gameState) {
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              color: "#fff",
            }}
          >
            <Typography>
              Connecting to lobby {gameId}...
            </Typography>
          </Box>
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MobileView
          gameState={gameState}
          username={username}
          onPlayCard={handlePlayCard}
          onDrawCard={handleDrawCard}
          onPassTurn={handlePassTurn}
          onShoutUno={handleShoutUno}
          onSelectColor={handleSelectColor}
        />
        <Snackbar
          open={showError}
          autoHideDuration={4000}
          onClose={() => setShowError(false)}
        >
          <Alert
            severity="error"
            onClose={() => setShowError(false)}
          >
            {errorMsg}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    );
  }

  // 3. PC Main Lobby Directory (When not in a room)
  if (!gameId) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container sx={{ py: 6 }}>
          {/* Dashboard Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 6,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{ fontWeight: 900 }}
              >
                Uno Card Game
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
              >
                Logged in as:{" "}
                <strong style={{ color: "#fff" }}>
                  {username}
                </strong>
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleLogout}
              sx={{ px: 3 }}
            >
              Logout
            </Button>
          </Box>

          <Grid container spacing={4}>
            {/* Left: Quick Actions */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper sx={{ p: 4, height: "100%" }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, mb: 4 }}
                >
                  Game Operations
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<AddBoxIcon />}
                  onClick={handleCreateLobby}
                  sx={{ py: 2, mb: 4, fontSize: "1.05rem" }}
                >
                  Create New Game Lobby
                </Button>

                <Divider sx={{ my: 3 }} />

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 2 }}
                >
                  Join Existing Lobby
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <TextField
                    fullWidth
                    label="Enter 5-character Code"
                    value={joinCodeInput}
                    onChange={(e) =>
                      setJoinCodeInput(e.target.value)
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      handleJoinLobby(joinCodeInput)
                    }
                    sx={{ px: 3 }}
                  >
                    Join
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Right: Active Lobbies */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper
                sx={{
                  p: 4,
                  minHeight: 350,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, mb: 3 }}
                >
                  Active Lobbies
                </Typography>

                {activeLobbies.length === 0 ? (
                  <Box
                    sx={{
                      m: "auto",
                      textAlign: "center",
                      color: "text.secondary",
                    }}
                  >
                    <Typography variant="body1">
                      No active lobbies at the moment.
                    </Typography>
                    <Typography variant="caption">
                      Create one to start playing with
                      friends!
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ flexGrow: 1 }}>
                    {activeLobbies.map((lobby) => (
                      <Paper
                        key={lobby.gameId}
                        sx={{
                          mb: 2,
                          p: 2,
                          background:
                            "rgba(255,255,255,0.02)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          border:
                            "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontWeight: 800,
                                fontSize: "1.1rem",
                              }}
                            >
                              Room Code: {lobby.gameId}
                            </Typography>
                          }
                          secondary={`Players: ${lobby.playerCount} / 4 | Status: ${lobby.status}`}
                        />
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<MeetingRoomIcon />}
                          onClick={() =>
                            handleJoinLobby(lobby.gameId)
                          }
                        >
                          Join Room
                        </Button>
                      </Paper>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <Snackbar
          open={showError}
          autoHideDuration={4000}
          onClose={() => setShowError(false)}
        >
          <Alert
            severity="error"
            onClose={() => setShowError(false)}
          >
            {errorMsg}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    );
  }

  // 4. PC Active Game Screen
  if (!gameState) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            color: "#fff",
          }}
        >
          <Typography variant="h6">
            Connecting to game session {gameId}...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  // The local server port is 5001, but the frontend port is whatever Vite binds to (typically window.location.port).
  const frontendPort =
    Number.parseInt(globalThis.location.port) || 5173;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 900 }}
              >
                Uno Card Board Table
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Playing as: <strong>{username}</strong> (PC
                View)
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleLeaveGame}
            >
              Leave Room
            </Button>
          </Box>

          <PCView
            gameState={gameState}
            username={username}
            lanIp={networkInfo.localIp}
            frontendPort={frontendPort}
            token={token}
            onSetReady={handleSetReady}
            onStartGame={handleStartGame}
            onCatchUno={handleCatchUno}
            onLeaveGame={handleLeaveGame}
          />
        </Container>
      </Box>
      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
      >
        <Alert
          severity="error"
          onClose={() => setShowError(false)}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
