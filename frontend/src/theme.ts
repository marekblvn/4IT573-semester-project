import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c27b0', // Purple accent
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    secondary: {
      main: '#ff9100', // Orange accent
    },
    background: {
      default: '#0a0a14',
      paper: '#121224',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 800,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.4)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px 0 rgba(0,0,0,0.6)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)',
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #ff9100 30%, #ffab40 90%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(18, 18, 36, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },
});

export const UNO_COLORS = {
  Red: '#ff5555',
  Blue: '#2f80ed',
  Yellow: '#f2c94c',
  Green: '#27ae60',
  Wild: 'linear-gradient(45deg, #ff5555, #f2c94c, #27ae60, #2f80ed)',
};
