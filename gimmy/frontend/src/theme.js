// src/theme.js
import { createTheme } from '@mui/material/styles';

// Suggested Modern Palette
const PRIMARY_MAIN = '#0A7366'; // A deep teal/green - energizing yet professional
const SECONDARY_MAIN = '#FF6B6B'; // A vibrant coral/red - for accents and calls to action
const BACKGROUND_DEFAULT = '#F8F9FA'; // Very light, almost white grey - for overall background
const BACKGROUND_PAPER = '#FFFFFF'; // Pure white for cards, modals, etc.
const TEXT_PRIMARY = '#1A2027';     // Dark grey, almost black - for primary text
const TEXT_SECONDARY = '#4A5568';   // Medium grey - for secondary text
const BORDER_RADIUS_VALUE = 12;      // Modern rounded corners

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_MAIN,
      // contrastText: '#FFFFFF', // Auto-calculated, but can be specified
    },
    secondary: {
      main: SECONDARY_MAIN,
      // contrastText: '#FFFFFF',
    },
    background: {
      default: BACKGROUND_DEFAULT,
      paper: BACKGROUND_PAPER,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
    },
    action: { // Define hover and selected states for better interactivity
        hover: 'rgba(0, 0, 0, 0.06)', // Light hover for list items, buttons
        selected: 'rgba(0, 0, 0, 0.08)',
    }
  },
  typography: {
    fontFamily: [
      'Inter', // Attempt to use Inter
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.5px' }, // Page titles
    h2: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.25px' }, // Section titles
    h3: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.3 },
    h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3 },       // Card titles, important headings
    h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },      // Smaller headings
    h6: { fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.4 },       // Sub-headings, logo
    subtitle1: { fontSize: '1rem', fontWeight: 500, color: TEXT_PRIMARY },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500, color: TEXT_SECONDARY },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6, color: TEXT_PRIMARY },
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5, color: TEXT_SECONDARY },
    button: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.9rem',
        letterSpacing: '0.5px',
    },
    caption: { fontSize: '0.75rem', color: TEXT_SECONDARY },
  },
  shape: {
    borderRadius: BORDER_RADIUS_VALUE,
  },
  components: {
    MuiCssBaseline: { // To ensure Inter font is applied globally if available via CDN
        styleOverrides: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body {
                font-family: 'Inter', 'Roboto', sans-serif;
            }
        `
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0, // Flatter AppBar
      },
      styleOverrides: {
        root: {
          backgroundColor: BACKGROUND_PAPER, // Light AppBar
          color: TEXT_PRIMARY,
          borderBottom: `1px solid rgba(0, 0, 0, 0.12)`, // Subtle border
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true, // Flatter buttons by default
      },
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS_VALUE - 4, // Slightly less rounded than cards for differentiation
          padding: '8px 20px', // More padding
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: PRIMARY_MAIN, // Darken on hover can be done via darken() utility from MUI
            boxShadow: '0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)', // Subtle hover shadow
          },
        },
        outlinedPrimary: {
            borderColor: PRIMARY_MAIN,
            '&:hover': {
                backgroundColor: 'rgba(10, 115, 102, 0.04)', // Primary color with low opacity
                borderColor: PRIMARY_MAIN,
            }
        }
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0, // Use border instead of shadow for a flatter design if preferred
      },
      styleOverrides: {
        root: {
          // borderRadius: BORDER_RADIUS_VALUE, // Already set by shape.borderRadius
          border: '1px solid rgba(0, 0, 0, 0.08)', // Softer border than default elevation
          // boxShadow: '0 4px 12px rgba(0,0,0,0.05)', // Example of a very subtle shadow
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          // For Paper used as background, like in Dashboards
          // backgroundColor: BACKGROUND_PAPER, // Handled by palette
        },
        outlined: { // Style for Paper variant="outlined"
            border: `1px solid rgba(0, 0, 0, 0.08)`,
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled', // Filled can look more modern than outlined if styled well
        InputLabelProps: { shrink: true } // Keep label always shrunk for filled variant
      },
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)', // Lighter fill
            borderRadius: BORDER_RADIUS_VALUE -4,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.06)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(0, 0, 0, 0.06)',
            },
            '&.Mui-disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
            }
          },
          '& .MuiFilledInput-underline:before': { // Remove underline for filled
            borderBottom: 'none',
          },
          '& .MuiFilledInput-underline:after': { // Remove underline for filled on focus
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          // textTransform: 'none', // in typography.button
          fontWeight: 600,
          borderRadius: `${BORDER_RADIUS_VALUE - 4}px ${BORDER_RADIUS_VALUE - 4}px 0 0`, // Rounded top corners for tabs
          '&.Mui-selected': {
            color: PRIMARY_MAIN,
          },
        },
      },
    },
    MuiTabs: {
        styleOverrides: {
            indicator: {
                backgroundColor: PRIMARY_MAIN,
                height: '3px',
            }
        }
    },
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: BORDER_RADIUS_VALUE / 2,
                fontWeight: 500,
            }
        }
    },
    MuiDialog: {
        styleOverrides: {
            paper: {
                // borderRadius: BORDER_RADIUS_VALUE, // from shape.borderRadius
            }
        }
    },
    MuiMenu: {
        styleOverrides: {
            paper: {
                // borderRadius: BORDER_RADIUS_VALUE, // from shape.borderRadius
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)', // Softer, more modern menu shadow
            }
        }
    },
    MuiAccordion: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: `1px solid rgba(0, 0, 0, 0.08)`,
          // borderRadius: BORDER_RADIUS_VALUE, // from shape.borderRadius
          '&:before': {
            display: 'none',
          },
          // Spacing between accordions if needed
          // '&:not(:last-child)': {
          //   marginBottom: '10px',
          // },
        },
      },
    },
    MuiListItemText: {
        styleOverrides: {
            primary: {
                fontWeight: 500,
            }
        }
    }
  },
});

export default theme;
