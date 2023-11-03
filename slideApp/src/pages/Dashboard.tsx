import { Typography, Button, Divider } from '@mui/material';
import { useUser } from '../providers/UserProvider';
import TransactionHistory from '../components/TransactionHistory';
import Balance from '../components/Balance';

function Dashboard() {
    const { setCurrentPage, user } = useUser();

    const onSend = () => {
        setCurrentPage('send');
    };

    return (
        <>
            <div style={{ padding: 16 }}>
                <Typography variant="h6">
                    <em>Quickly send USDC</em>
                </Typography>
                <Balance />
                <Typography variant="h6" style={{ marginBottom: 16 }}>
                    {user?.sns}
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginBottom: 16 }}
                    onClick={onSend}
                >
                    Send USDC
                </Button>
            </div>

            <Divider />

            <TransactionHistory />
        </>
    );
}

export default Dashboard;
