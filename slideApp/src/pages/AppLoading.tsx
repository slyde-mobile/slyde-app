import { motion } from 'framer-motion';
import AppLoadingImage from '../components/AppLogoLoading';

function AppLoading() {
    return (
        <motion.div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: '100vh', // vh stands for viewport height units
                margin: '0px', // Set margin here
                border: '2px solid', // Set border style here
                boxSizing: 'border-box', // Ensure margin is included in element dimensions
            }}
            initial={{ borderColor: '#ffcc33' }} // Initial color
            animate={{ borderColor: ['#ffcc33', '#9933ff'] }} // Color animation
            transition={{
                duration: 2, // Adjust duration to your liking
                repeat: Infinity, // Repeat animation indefinitely
                repeatType: 'reverse', // Reverse animation on each iteration
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    flexGrow: 1,
                }}
            >
                <AppLoadingImage />
            </div>
        </motion.div>
    );
}

export default AppLoading;
