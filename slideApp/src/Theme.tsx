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
          }
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                backgroundColor: '#f2b842',
                borderColor: '#2d2d2d',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: '#d9a534', // A slightly darker shade when hovered
                },
              },
            },
          },
        },
      });

export default Theme;