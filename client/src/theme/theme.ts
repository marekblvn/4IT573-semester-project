import { createTheme, type Theme } from "@mui/material";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";

const theme: Theme = createTheme({
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
    fontSize: 12,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 700,
      letterSpacing: "1px",
    },
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiInput: {
      styleOverrides: {
        input: {
          backgroundColor: "#2442FF",
        },
      },
    },
  },
});

export default theme;
