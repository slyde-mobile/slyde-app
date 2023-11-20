import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
    palette: {
        primary: {
            main: '#813ef9', // Purple
            light: '#813ef9',
            dark: '#0e1848', // Dark blue
        },
        secondary: {
            main: '#f2b842', // Yellow
            light: '#f2b842',
            dark: '#cc9900', // Dark yellow
        },
        background: {
            default: '#0e1848', // Dark blue background
        },
        error: {
            main: '#ff0000',
        },
        text: {
            secondary: '#f2b842',
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& label.Mui-focused': {
                        color: '#f2b842', // Label color when the input is focused
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#f2b842', // Default border color
                        },
                        '&:hover fieldset': {
                            borderColor: '#f2b842', // Border color on hover (if you want it to change)
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#f2b842', // Border color when the input is focused
                        },
                        '& .MuiOutlinedInput-input': {
                            color: '#f2b842', // Text color
                        },
                    },
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    marginLeft: 0, // Remove left margin
                    paddingLeft: 0, // Remove left padding
                    color: '#fff',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffcc33',
                    borderColor: '#cc9900',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderRadius: 0,
                    color: '#222222',
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
