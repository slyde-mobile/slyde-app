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
            default: '#0e1848',
        },
        error: {
            main: '#ff0000',
        },
    },
    components: {
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    marginLeft: 0, // Remove left margin
                    paddingLeft: 0, // Remove left padding
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: '#f2b842',
                    borderColor: '#cc9900',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderRadius: 0,
                    padding: '5px 20px',
                    '&:hover': {
                        backgroundColor: '#d9a534', // A slightly darker shade when hovered
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0e1848',
                    boxShadow: 'none',
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
        },
    },
});

export default Theme;
