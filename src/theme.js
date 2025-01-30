import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const APP_BAR_HEIGHT = '58px'
const BOARD_BAR_HEIGHT = '60px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`
const HEADER_COLUMN_HEIGHT = '50px'
const FOOTER_COLUMN_HEIGHT = '56px'
// Create a theme instance.
const theme = extendTheme({
  trello: {
    headerColumnHeight: HEADER_COLUMN_HEIGHT,
    footerColumnHeight: FOOTER_COLUMN_HEIGHT,
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT
  },
  colorSchemes: {
    // light: {
    //   palette: {
    //     primary: teal,
    //     secondary: deepOrange
    //   }
    //   //Có thể định nghĩa spacing trong theme
    //   //spacing: (factor) => `${0.25 * factor}rem`
    // },
    // dark: {
    //   palette: {
    //     primary: cyan,
    //     secondary: orange
    //   }
    // }
  },
  components: {
    //custom scroll
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            background: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            background: 'white'
          }
        }
      }
    },
    //custom button
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', //fix the uppercase letters
          borderWidth: '1px solid',
          '&:hover': {
            borderWidth: '1px solid'
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root:  {
          '&.MuiTypography-body1': {
            fontSize: '0.875rem'
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: (/*{ theme }*/) => {
          return {
            //color: theme.palette.primary.main,
            fontSize: '0.875rem'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: (/*{ theme }*/) => {
          return {
            //color: theme.palette.primary.main,
            fontSize: '0.875rem',
            // '.MuiOutlinedInput-notchedOutline': {
            //   borderColor: `${theme.palette.primary.light} !important` // default border
            // },
            // '&:hover': {
            //   '.MuiOutlinedInput-notchedOutline': {
            //     borderColor: `${theme.palette.primary.main} !important`
            //   }
            // },
            '& fieldset': {
              borderWidth: '0.5px !important'
            },
            '&:hover fieldset': {
              borderWidth: '2px !important'
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px !important'
            }
          }
        }
      }
    }
  }
}
)

export default theme
