import { Container, Snackbar } from '@mui/material';
import AppTopBar from '../components/AppTopBar';
import PageSelector from '../components/PageSelector';
import { ActionTypes, useGlobalState } from '../providers/GlobalStateProvider';

function LoggedIn() {
    const { dispatch, state } = useGlobalState();
    const { processingTransactionState } = state;

    const hideToast = () => {
        dispatch({
            type: ActionTypes.SetTransactionState,
            payload: 'not_started',
        });
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
