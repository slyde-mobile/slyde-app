import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
        palette: {
          primary: {
            main: '#fff',
            light: '#fff',
            dark: '#0e1848',
          },
          secondary: {
            main: '#f2b842',
          },
          background: {
            default: '#813ef9',
          },
          error: {
            main: '#ff0000',
          }
        },
        components: {
          MuiFormHelperText: {
            styleOverrides: {
              root: {
                marginLeft: 0,  // Remove left margin
                paddingLeft: 0,  // Remove left padding
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                backgroundColor: '#f2b842',
                borderColor: '#2d2d2d',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: 0,
                padding: 0,
                '&:hover': {
                  backgroundColor: '#d9a534', // A slightly darker shade when hovered
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: '#813ef9',
              },
            },
          },
          MuiContainer: {
            styleOverrides: {
              root: {
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                padding: '0 !important',
                width: '100%', 
                maxWidth: 'none',
              },
            },
          }
        },
      });

export default Theme;