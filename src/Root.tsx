import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme';
import './App.css';
import App from './App';
import { ClientsProvider } from './providers/ClientsProvider';
import { GlobalStateProvider } from './providers/GlobalStateProvider';

function Root() {
    const onConnected = () => {
        // console.log('Connected!');
        // setLoggedIn(true);
    };

    const onConnecting = () => {
        // console.log('Connecting...');
        // setLoggedIn(false);
        // setLoading(true);
    };

    return (
        <ThemeProvider theme={theme}>
            <GlobalStateProvider>
                <ClientsProvider
                    onConnecting={onConnecting}
                    onConnected={onConnected}
                >
                    <App />
                </ClientsProvider>
            </GlobalStateProvider>
        </ThemeProvider>
    );
}

export default Root;
