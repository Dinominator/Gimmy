// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Example: Blue
    },
    secondary: {
      main: '#dc004e', // Example: Pink
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 500 },
    // Add more typography variants as needed
  },
  // You can also customize components globally here
  // components: {
  //   MuiButton: {
  //     styleOverrides: {
  //       root: {
  //         textTransform: 'none',
  //       },
  //     },
  //   },
  // },
});

export default theme;
