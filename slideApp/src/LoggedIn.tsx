import ChooseUsername from './pages/ChooseUsername';
import Dashboard from './pages/Dashboard';
import { useUser } from './providers/UserProvider';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    IconButton,
    Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendPrompt from './pages/Send';

function MenuIconSwitcher(props: { currentPage: string }) {
    switch (props.currentPage) {
        case 'send':
            return <ArrowBackIcon />;
        default:
            return <></>;
    }
}

function LoggedIn() {
    const {
        user,
        currentPage,
        setCurrentPage,
        processingTransactionState,
        setProcessingTransactionState,
    } = useUser();

    const handleBackClick = () => {
        setCurrentPage('dashboard');
    };

    const PageSwitcher = () => {
        if (user != null && user.sns != null) {
            switch (currentPage) {
                case 'send':
                    return <SendPrompt />;
                default:
                    return <Dashboard />;
            }
        }
        return <ChooseUsername />;
    };

    const hideToast = () => {
        setProcessingTransactionState('not_started');
    };

    return (
        <Container
            style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={
                            currentPage === 'send' ? handleBackClick : undefined
                        }
                    >
                        <MenuIconSwitcher currentPage={currentPage} />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        color="secondary"
                        sx={{ flexGrow: 1 }}
                    >
                        Slyde
                    </Typography>
                    <Button color="inherit">Logout</Button>
                </Toolbar>
            </AppBar>

            <PageSwitcher />
            {processingTransactionState === 'processing' && (
                <Snackbar open={true} message="Processing Transaction" />
            )}
            {processingTransactionState === 'completed' && (
                <Snackbar
                    open={true}
                    onClose={hideToast}
                    autoHideDuration={6000}
                    message="Completed Transaction"
                />
            )}
        </Container>
    );
}

export default LoggedIn;
