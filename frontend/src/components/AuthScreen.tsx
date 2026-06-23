import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

interface AuthScreenProps {
  apiBaseUrl: string;
  onAuthSuccess: (token: string, username: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  apiBaseUrl,
  onAuthSuccess,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      onAuthSuccess(data.token, data.user.username);
    } catch (err: unknown) {
      setError(
        (err as Error).message || "An error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const submitButtonContent = useMemo(() => {
    if (loading) {
      return <CircularProgress size={24} color="inherit" />;
    }
    if (isLogin) {
      return "Login";
    }
    return "Register";
  }, [isLogin, loading]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        padding: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(18, 18, 36, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 12px 40px 0 rgba(0, 0, 0, 0.5)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Custom Uno Glowing Logo */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background:
                  "linear-gradient(45deg, #ff5555, #f2c94c, #27ae60, #2f80ed)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow:
                  "0 0 20px rgba(156, 39, 176, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.3)",
                border: "3px solid #fff",
                transform: "rotate(-10deg)",
                mb: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 950,
                  fontSize: "2.2rem",
                  color: "#fff",
                  fontFamily: '"Outfit", sans-serif',
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                  transform: "rotate(10deg)",
                }}
              >
                Uno!
              </Typography>
            </Box>
            <Typography
              variant="h5"
              align="center"
              sx={{ fontWeight: 800, letterSpacing: 0.5 }}
            >
              {isLogin ? "Welcome Back" : "Create Account"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 0.5 }}
            >
              {isLogin
                ? "Enter your credentials to play"
                : "Join the game lobbies and play with friends"}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{
                mb: 3.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: "1rem",
                mb: 2,
              }}
            >
              {submitButtonContent}
            </Button>

            <Button
              fullWidth
              variant="text"
              color="secondary"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              disabled={loading}
              sx={{ py: 1 }}
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
