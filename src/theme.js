import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: '58px',
    boardBarHeight: '60px'
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
