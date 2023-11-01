import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme';
import './App.css';
import App from './App';
import { ClientsProvider } from './providers/ClientsProvider';
import { UserProvider } from './providers/UserProvider';

function Root() {
    const onConnected = () => {
        console.log('Connected!');
        // setLoggedIn(true);
    };

    const onConnecting = () => {
        console.log('Connecting...');
        // setLoggedIn(false);
        // setLoading(true);
    };

    return (
        <ThemeProvider theme={theme}>
            <ClientsProvider
                onConnecting={onConnecting}
                onConnected={onConnected}
            >
                <UserProvider>
                    <App />
                </UserProvider>
            </ClientsProvider>
        </ThemeProvider>
    );
}

export default Root;
