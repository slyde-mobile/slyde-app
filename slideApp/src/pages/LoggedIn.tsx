import { useUser } from '../providers/UserProvider';
import { Container, Snackbar } from '@mui/material';
import AppTopBar from '../components/AppTopBar';
import PageSelector from '../components/PageSelector';

function LoggedIn() {
    const { processingTransactionState, setProcessingTransactionState } =
        useUser();

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
            <AppTopBar />

            <PageSelector />
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
