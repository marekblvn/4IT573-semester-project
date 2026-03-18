import {
  useCallback,
  useMemo,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import { enqueueSnackbar } from "notistack";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordHidden, setPasswordHidden] = useState<boolean>(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (e: ReactMouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      try {
        const data = await authService.login({ username, password });
        login(data.token, data.username);
        navigate("/");
      } catch {
        enqueueSnackbar({ variant: "error", message: `Invalid login` });
      }
    },
    [login, navigate, password, username],
  );

  const passwordEndAdornmentIcon = useMemo(() => {
    if (passwordHidden) {
      return <VisibilityRoundedIcon fontSize="small" />;
    }
    return <VisibilityOffRoundedIcon fontSize="small" />;
  }, [passwordHidden]);

  const passwordInputType = useMemo(() => {
    if (passwordHidden) {
      return "password";
    }
    return "text";
  }, [passwordHidden]);

  return (
    <Paper
      elevation={2}
      sx={{
        width: { xs: "100%", sm: "300px" },
        height: { xs: "100%", sm: "auto" },
        alignContent: "center",
        padding: { xs: 0, sm: "16px" },
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          justifySelf: "center",
          display: "grid",
          justifyContent: "center",
          rowGap: "16px",
        }}
      >
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          type="text"
          size="small"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type={passwordInputType}
          size="small"
          onChange={(e) => setPassword(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setPasswordHidden((prev) => !prev)}
                    edge="end"
                    size="small"
                  >
                    {passwordEndAdornmentIcon}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Stack direction="column" rowGap="8px" marginTop="2px">
          <Button
            type="submit"
            variant="contained"
            sx={{ fontWeight: 700, textTransform: "none" }}
            onClick={handleLogin}
          >
            Log In
          </Button>
          <Button
            variant="text"
            type="button"
            sx={{ fontWeight: 500, textTransform: "none" }}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default Login;
