// src/theme.js
import { createTheme, alpha } from '@mui/material/styles'; // Import alpha for opacity

// Modern Fitness App Palette Inspiration
const PRIMARY_MAIN = '#00796B'; // A deep teal/green - Professional, Calming, Trustworthy
// const PRIMARY_MAIN = '#1976D2'; // Classic Google Blue - if preferred
const PRIMARY_LIGHT = alpha(PRIMARY_MAIN, 0.9);
const PRIMARY_DARK = alpha(PRIMARY_MAIN, 0.7); // Example, or a darker shade like #004D40

const SECONDARY_MAIN = '#FF7043'; // Vibrant Coral/Orange - Energizing, Action-oriented
// const SECONDARY_MAIN = '#FFC107'; // Amber/Yellow for a different vibe
const SECONDARY_LIGHT = alpha(SECONDARY_MAIN, 0.9);
const SECONDARY_DARK = alpha(SECONDARY_MAIN, 0.7); // Example, or a darker shade like #F5560A

const BACKGROUND_DEFAULT = '#F5F5F5'; // Very light grey for overall background (slightly off-white)
const BACKGROUND_PAPER = '#FFFFFF';   // Pure white for cards, modals, interactive elements
const TEXT_PRIMARY = '#263238';       // Dark Slate Grey - for primary text, good readability
const TEXT_SECONDARY = '#546E7A';     // Lighter Slate Grey - for secondary text
const BORDER_COLOR = 'rgba(0, 0, 0, 0.12)'; // Standard border color
const BORDER_RADIUS_SM = 8;
const BORDER_RADIUS_MD = 12;
const BORDER_RADIUS_LG = 16;


const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_MAIN,
      light: PRIMARY_LIGHT,
      dark: PRIMARY_DARK,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: SECONDARY_MAIN,
      light: SECONDARY_LIGHT,
      dark: SECONDARY_DARK,
      contrastText: '#FFFFFF',
    },
    background: {
      default: BACKGROUND_DEFAULT,
      paper: BACKGROUND_PAPER,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
      disabled: alpha(TEXT_PRIMARY, 0.38),
    },
    divider: BORDER_COLOR,
    action: {
      active: alpha(PRIMARY_MAIN, 0.54),
      hover: alpha(PRIMARY_MAIN, 0.06), // Subtle hover for primary elements
      selected: alpha(PRIMARY_MAIN, 0.12),
      disabled: alpha(TEXT_PRIMARY, 0.26),
      disabledBackground: alpha(TEXT_PRIMARY, 0.12),
      focus: alpha(PRIMARY_MAIN, 0.12),
    },
  },
  typography: {
    fontFamily: [
      'Inter', // Attempt to use Inter
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    // Define weights for Inter if loaded
    fontWeightLight: 300, // Inter typically doesn't have a 'light' this light, usually starts at 400
    fontWeightRegular: 400,
    fontWeightMedium: 500, // Good for subtitles, emphasis
    fontWeightBold: 700,   // Good for main titles

    h1: { fontSize: '2.75rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.015em' },
    h2: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.005em' },
    h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.35 },
    h5: { fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.4 }, // Good for card titles
    h6: { fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.45 }, // Good for smaller titles/logo
    subtitle1: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.5, color: TEXT_SECONDARY },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.65 }, // Increased line height for readability
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.6, color: TEXT_SECONDARY },
    button: {
        textTransform: 'none',
        fontWeight: 600, // Medium-Bold buttons
        fontSize: '0.9rem',
        letterSpacing: '0.02em', // Slight letter spacing for buttons
    },
    caption: { fontSize: '0.75rem', fontWeight: 400, color: TEXT_SECONDARY, lineHeight: 1.4 },
    overline: { fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'}
  },
  shape: {
    borderRadius: BORDER_RADIUS_MD, // Default border radius for most components
  },
  components: {
    MuiCssBaseline: {
        styleOverrides: (themeParam) => ({ // themeParam gives access to the fully constructed theme
            "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');": {}, // CSS trick for @import
            body: {
                fontFamily: themeParam.typography.fontFamily,
                backgroundColor: themeParam.palette.background.default, // Ensure body bg matches
            },
            '*': { // Better box-sizing by default
                boxSizing: 'border-box',
            },
            '::-webkit-scrollbar': { // Basic scrollbar styling
                width: '8px',
                height: '8px',
            },
            '::-webkit-scrollbar-track': {
                background: alpha(themeParam.palette.primary.light, 0.1),
            },
            '::-webkit-scrollbar-thumb': {
                background: alpha(themeParam.palette.primary.main, 0.6),
                borderRadius: '4px',
                '&:hover': {
                    background: themeParam.palette.primary.main,
                }
            }
        }),
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({theme: themeParam}) => ({ // Use themeParam here
          backgroundColor: BACKGROUND_PAPER,
          color: TEXT_PRIMARY,
          borderBottom: `1px solid ${themeParam.palette.divider}`,
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        // disableElevation: true, // Can be default for all variants
      },
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS_SM,
          padding: '10px 22px', // Generous padding
        },
        contained: { // For all contained buttons
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', // Very subtle shadow for contained
             '&:hover': {
                boxShadow: '0 2px 4px -1px rgba(0,0,0,0.07), 0 4px 5px 0 rgba(0,0,0,0.05)',
             }
        },
        // containedPrimary specific hover is defined in palette.action.hover or can be here
        outlinedPrimary: {
            // borderColor: PRIMARY_MAIN, // Handled by palette
            '&:hover': {
                backgroundColor: alpha(PRIMARY_MAIN, 0.04),
            }
        }
      },
    },
    MuiCard: {
      defaultProps: {
        variant: "outlined", // Default to outlined cards for a cleaner look
      },
      styleOverrides: {
        root: ({theme: themeParam}) => ({
          borderRadius: BORDER_RADIUS_MD, // from shape.borderRadius
          // border: `1px solid ${themeParam.palette.divider}`, // if variant="outlined" is default
          // boxShadow: 'none', // if variant="outlined" is default
          // For elevation variant (if used):
          // '&.MuiPaper-elevation1': {
          //   boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          // },
        }),
      },
    },
    MuiPaper: {
      defaultProps: {
        // elevation: 0, // Default to no elevation, use variant="outlined" or specific elevation
      },
      styleOverrides: {
        root: {
           borderRadius: BORDER_RADIUS_MD, // Ensure paper also gets default radius
        },
        outlined: ({theme: themeParam}) => ({
            border: `1px solid ${themeParam.palette.divider}`,
            borderRadius: BORDER_RADIUS_MD,
        })
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
        InputLabelProps: { shrink: true }
      },
      styleOverrides: {
        root: ({theme: themeParam}) => ({
          '& .MuiFilledInput-root': {
            backgroundColor: alpha(themeParam.palette.action.hover, 0.5), // Very light fill, derived from action.hover
            borderRadius: BORDER_RADIUS_SM,
            border: `1px solid transparent`, // Prepare for focus border
            transition: themeParam.transitions.create(['background-color', 'border-color']),
            '&:hover': {
              backgroundColor: themeParam.palette.action.hover,
            },
            '&.Mui-focused': {
              backgroundColor: BACKGROUND_PAPER, // White on focus for contrast
              borderColor: themeParam.palette.primary.main,
            },
            '&.Mui-disabled': {
                backgroundColor: alpha(themeParam.palette.action.disabledBackground, 0.5),
            }
          },
          '& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after': {
            display: 'none', // Remove underline for filled
          },
          '& .MuiInputLabel-filled': { // Adjust label position for filled variant
            '&.MuiInputLabel-shrink': {
                transform: 'translate(12px, 7px) scale(0.75)',
            }
          }
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({theme: themeParam}) => ({
          fontWeight: 600,
          borderRadius: `${BORDER_RADIUS_SM}px ${BORDER_RADIUS_SM}px 0 0`,
          borderBottom: 'none', // Remove bottom border from individual tabs
          '&.Mui-selected': {
            color: themeParam.palette.primary.main,
            // backgroundColor: alpha(themeParam.palette.primary.main, 0.08), // Optional: slight bg for selected tab
          },
          '&:hover': {
            backgroundColor: themeParam.palette.action.hover,
          }
        }),
      },
    },
    MuiTabs: {
        styleOverrides: {
            root: ({theme: themeParam}) => ({
                borderBottom: `2px solid ${themeParam.palette.divider}`, // Overall bottom border for Tabs container
            }),
            indicator: ({theme: themeParam}) => ({
                backgroundColor: themeParam.palette.primary.main,
                height: '2px', // Thinner, more modern indicator
            })
        }
    },
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: BORDER_RADIUS_SM / 1.5,
                fontWeight: 500,
            }
        }
    },
    MuiDialog: {
        styleOverrides: {
            paper: {
                 borderRadius: BORDER_RADIUS_LG, // Larger radius for dialogs
            }
        }
    },
    MuiMenu: {
        styleOverrides: {
            paper: ({theme: themeParam}) => ({
                 boxShadow: themeParam.shadows[8], // Use a standard MUI shadow
            })
        }
    },
    MuiAccordion: {
      defaultProps: {
        variant: "outlined", // Default to outlined accordions
      },
      styleOverrides: {
        root: ({theme: themeParam}) => ({
          // border: `1px solid ${themeParam.palette.divider}`, // Handled by variant="outlined"
          // borderRadius: BORDER_RADIUS_MD, // From shape.borderRadius
          '&:before': { display: 'none', },
        }),
      },
    },
    MuiListItemText: {
        styleOverrides: {
            primary: { fontWeight: 500, },
            secondary: { fontSize: '0.8rem' } // Slightly smaller secondary text in lists
        }
    },
    MuiTooltip: {
        styleOverrides: {
            tooltip: ({theme: themeParam}) => ({
                backgroundColor: alpha(TEXT_PRIMARY, 0.92),
                borderRadius: BORDER_RADIUS_SM / 2,
                fontSize: '0.75rem',
                padding: '6px 10px',
            }),
            arrow: ({theme: themeParam}) => ({
                color: alpha(TEXT_PRIMARY, 0.92),
            })
        }
    }
  },
});

export default theme;
