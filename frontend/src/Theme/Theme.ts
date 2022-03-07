import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export let theme = createTheme({
  typography: {
    fontFamily: ['Inter','Roboto', 'Helvetica', 'Arial',  'sans-serif'].join(',')
  },
  // breakpoints: {
  //   values: {
  //     xs: 0,
  //     sm: 600,
  //     md: 900,
  //     lg: 1200,
  //     xl: 1920, //updated from 1536
  //   }
  // },
  palette: {
    mode: 'light',
    primary: {
      main: '#22262C',
    },
    secondary: {
      main: '#69f0ae',
    },
    warning: {
      main: '#c36f00',
    },
    // action: {
    //   hover: '#69f0ae',
    //   hoverOpacity: 0.1
    // },
  },
  components: {
    MuiTableContainer: {
      styleOverrides: {},
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px'
        }
      }
    },
    MuiAppBar: {
      defaultProps: {
        color: 'inherit',
        elevation: 3,
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        }
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        color: 'primary'
      },
    },
    // MuiInputBase: {
    //   styleOverrides: {
    //     root: {
    //       borderRadius: '16px'
    //     }
    //   }
    // }

    // MuiDrawer: {
    //   styleOverrides: {
    //     paper : {
    //       backgroundColor: '#282c34',
    //     }
    //   }
    // }
  },
});

 theme = responsiveFontSizes(theme);
