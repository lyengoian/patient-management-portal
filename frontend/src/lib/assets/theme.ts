import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#DE7D41',
      light: '#CDBDE4',
      dark: '#913F3D',
      contrastText: 'white',
    },
    secondary: {
      main: '#40543C',
      light: '#C4D2C0',
      dark: '#155d5a',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ff1744',
    },
    background: {
      default: '#f4f4f9',
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            color: '#473B52',
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: '#473B52',
            color: 'white'
          },
        },
      },
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
    },
  },
});

export default theme;
