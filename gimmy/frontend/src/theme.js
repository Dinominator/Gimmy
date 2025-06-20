// src/theme.js
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors'; // Example for error color

// Google Inspired Colors (example, can be refined)
const PRIMARY_COLOR = '#1a73e8'; // Google Blue
const SECONDARY_COLOR = '#ff6e00'; // Example: Google Orange/Amber as accent
const BACKGROUND_DEFAULT = '#f8f9fa'; // Very light grey, common in Google UIs
const BACKGROUND_PAPER = '#ffffff'; // White for cards, modals, etc.
const TEXT_PRIMARY = 'rgba(0, 0, 0, 0.87)'; // Standard dark text
const TEXT_SECONDARY = 'rgba(0, 0, 0, 0.6)';
const BORDER_RADIUS = 8; // Slightly more rounded corners

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
    },
    secondary: {
      main: SECONDARY_COLOR,
    },
    error: {
      main: red.A400,
    },
    background: {
      default: BACKGROUND_DEFAULT,
      paper: BACKGROUND_PAPER,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.2rem', fontWeight: 500, letterSpacing: '-0.5px' },
    h2: { fontSize: '1.8rem', fontWeight: 500, letterSpacing: '-0.25px' },
    h3: { fontSize: '1.5rem', fontWeight: 500 },
    h4: { fontSize: '1.3rem', fontWeight: 500 },
    h5: { fontSize: '1.15rem', fontWeight: 500 }, // Used for Sign In/Up titles
    h6: { fontSize: '1rem', fontWeight: 500 },    // Used for Logo
    subtitle1: { fontSize: '1rem', fontWeight: 400 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
    body1: { fontSize: '1rem', fontWeight: 400 },
    body2: { fontSize: '0.875rem', fontWeight: 400 },
    button: { textTransform: 'none', fontWeight: 500 }, // Buttons with normal casing
  },
  shape: {
    borderRadius: BORDER_RADIUS,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: BACKGROUND_PAPER, // Lighter AppBar, more modern
          color: TEXT_PRIMARY, // Dark text on light AppBar
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', // Softer shadow
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS,
          // textTransform: 'none', // Already in typography.button
        },
        containedPrimary: {
          // Example: if you want specific button styling
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)', // Softer card shadow
        },
      },
    },
    MuiPaper: {
     styleOverrides: {
       root: {
         // backgroundColor: BACKGROUND_PAPER, // Default
       },
       elevation1: { // Example for Paper with elevation 1
         boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
       }
     }
    },
    MuiTextField: {
     defaultProps: {
       variant: 'outlined', // Prefer outlined text fields
     },
     styleOverrides: {
       root: {
         // Custom styles for text fields if needed
       }
     }
    },
    MuiTab: {
     styleOverrides: {
       root: {
         textTransform: 'none', // Keep tab labels normal case
         fontWeight: 500,
       }
     }
    },
    MuiDialog: {
     styleOverrides: {
       paper: {
         borderRadius: BORDER_RADIUS,
       }
     }
    },
    MuiMenu: {
     styleOverrides: {
       paper: {
         borderRadius: BORDER_RADIUS,
         boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
       }
     }
    },
    MuiAccordion: {
     styleOverrides: {
       root: {
         boxShadow: 'none',
         '&:before': {
           display: 'none', // Remove the default top border on accordions
         },
         // '&.$expanded': { // This SASS-like syntax might not work directly here. Use specific class or structure.
         //   margin: 'auto',
         // },
       },
       rounded: { // ensure rounded prop applies custom radius
         borderRadius: BORDER_RADIUS,
         '&:first-of-type': {
           borderTopLeftRadius: BORDER_RADIUS,
           borderTopRightRadius: BORDER_RADIUS,
         },
         '&:last-of-type': {
           borderBottomLeftRadius: BORDER_RADIUS,
           borderBottomRightRadius: BORDER_RADIUS,
         },
       }
     }
    }
  },
});

export default theme;
