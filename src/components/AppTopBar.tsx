import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { motion } from 'framer-motion';

import { useUser } from '../providers/UserProvider';
import AppTopBarIcon from './AppTopBarIcon';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { useContext, useEffect, useState } from 'react';
import { Web3AuthContext } from '../providers/ClientsProvider';
import LogoutIcon from '@mui/icons-material/Logout';

function AppTopBar() {
    const { currentPage, setCurrentPage, setLoggedIn } = useUser();
    const web3Auth: Web3AuthNoModal | undefined = useContext(Web3AuthContext);

    const [showSlydeText, setShowSlydeText] = useState(true);

    const variants = {
        hidden: { y: '-100%', opacity: 0 },
        visible: { y: '0%', opacity: 1 },
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0 && showSlydeText) {
                setShowSlydeText(false);
            } else if (window.scrollY === 0 && !showSlydeText) {
                setShowSlydeText(true);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [showSlydeText]);

    const handleBackClick = () => {
        setCurrentPage('dashboard');
    };

    const logout = async () => {
        if (!web3Auth) {
            return;
        }
        await web3Auth.logout();
        setLoggedIn(false);
    };

    return (
        <AppBar position="fixed">
            <Toolbar style={{ padding: '0' }}>
                <div style={{ flex: 1, textAlign: 'left', padding: '0' }}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ ml: 1 }}
                        onClick={
                            currentPage === 'send' || currentPage === 'receive' ? handleBackClick : undefined
                        }
                    >
                        <AppTopBarIcon currentPage={currentPage} />
                    </IconButton>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <motion.div
                        initial="visible" // Set the initial state
                        animate={showSlydeText ? 'visible' : 'hidden'} // Toggle between hidden and visible states
                        variants={variants} // Define the animation variants
                    >
                        <Typography
                            variant="h6"
                            component="div"
                            color="secondary"
                            sx={{ flexGrow: 1 }}
                        >
                            Slyde
                        </Typography>
                    </motion.div>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 1 }}
                        onClick={logout}
                    >
                        <LogoutIcon />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default AppTopBar;
