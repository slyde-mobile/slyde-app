import { Typography, Button, Divider, Box } from '@mui/material';
import TransactionHistory from '../components/TransactionHistory';
import Balance from '../components/Balance';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import ReceiveIcon from '@mui/icons-material/AttachMoneyRounded';
import AddIcon from '@mui/icons-material/AddCircleOutline';
import { ActionTypes, useGlobalState } from '../providers/GlobalStateProvider';
import { Page } from '../components/PageSelector';

function Dashboard() {
    const { dispatch } = useGlobalState();
    // const web3Auth: Web3AuthNoModal | undefined = useContext(Web3AuthContext);
    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = () => {
        setIsScrolled(window.scrollY > 0);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const onSend = () => {
        dispatch({
            type: ActionTypes.SetCurrentPage,
            payload: { page: Page.Send, object: null },
        });
    };

    const onAddFunds = () => {
        dispatch({
            type: ActionTypes.SetCurrentPage,
            payload: { page: Page.Receive, object: null },
        });
    };

    return (
        <>
            <Box
                sx={{
                    margin: 2,
                    marginTop: 10,
                    borderRadius: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div>
                    <Typography variant="subtitle1" align="left">
                        Current Balance
                    </Typography>
                    <Balance />
                </div>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    p: 0,
                    margin: 2,
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    sx={{ height: '2.75rem', flexGrow: 1, flexBasis: 'auto' }}
                    variant="contained"
                    onClick={onSend}
                    color="primary"
                    endIcon={<SendIcon />}
                >
                    Pay
                </Button>
                <Box sx={{ width: 12 }} />
                <Button
                    sx={{ height: '2.75rem', flexGrow: 1, flexBasis: 'auto' }}
                    variant="contained"
                    onClick={onAddFunds}
                    color="primary"
                    endIcon={<AddIcon />}
                >
                    Add Funds
                </Button>
                <Box sx={{ width: 12 }} />
                <Button
                    sx={{ height: '2.75rem', flexGrow: 1, flexBasis: 'auto' }}
                    variant="contained"
                    color="primary"
                    endIcon={<ReceiveIcon />}
                    disabled
                >
                    Request
                </Button>
                <Box sx={{ height: '2rem', flexGrow: 10, flexBasis: 'auto' }} />
            </Box>

            <Divider
                sx={{
                    borderColor: '#813ef9',
                    my: 2,
                    margin: '0px 14px 0 14px',
                }}
            />
            <Box
                sx={{
                    margin: 2,
                    borderRadius: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            ></Box>
            <TransactionHistory />
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: isScrolled ? 0 : 100 }} // Slide down by 100px when scrolled
                transition={{ ease: 'easeIn', duration: 0.3 }}
                style={{
                    position: 'fixed', // Changed to 'fixed' to keep it at the bottom
                    bottom: 0,
                    left: 0,
                    zIndex: 1000,
                    width: '100%',
                    padding: '20px',
                    backgroundColor: '#0e1848',
                    display: 'flex', // Added to center the button horizontally
                    justifyContent: 'center', // Added to center the button horizontally
                    boxSizing: 'border-box',
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onSend}
                    sx={{
                        maxWidth: `calc(100% - 20px)`,
                        width: `calc(100% - 20px)`,
                    }} // Set a maxWidth to account for the padding
                    endIcon={<SendIcon />}
                >
                    Send USDC
                </Button>
            </motion.div>
        </>
    );
}

export default Dashboard;
