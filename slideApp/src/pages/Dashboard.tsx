import { Typography, Button, Divider, Box } from '@mui/material';
import { useUser } from '../providers/UserProvider';
import TransactionHistory from '../components/TransactionHistory';
import Balance from '../components/Balance';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';

function Dashboard() {
    const { setCurrentPage, user } = useUser();

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
        setCurrentPage('send');
    };

    return (
        <>
            <Typography variant="h4" sx={{ padding: 2, paddingLeft: 4 }}>
                Quickly send USDC
            </Typography>

            <Box
                sx={{
                    background: 'rgba(153, 51, 255, 0.2)', // Light purple background with transparency
                    padding: 2,
                    margin: 2,
                    borderRadius: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div>
                    <Typography variant="subtitle1" align="left">
                        USDC Balance
                    </Typography>
                    <Balance />
                    <Typography variant="subtitle1" align="left">
                        @{user?.sns}
                    </Typography>
                </div>
                <div>
                    <Button
                        sx={{ height: '3rem', alignSelf: 'center' }}
                        variant="contained"
                        onClick={onSend}
                        color="primary"
                        endIcon={<SendIcon />}
                    >
                        Send
                    </Button>
                </div>
            </Box>

            <Divider />

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
