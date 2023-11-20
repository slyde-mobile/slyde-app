import { FC } from 'react';
import SmsIcon from '@mui/icons-material/Sms';
import { motion } from 'framer-motion';


interface SMSLoginButtonProps {
    onClick: () => void;
    showText: boolean;
};

const buttonVariants = {
    initial: { width: '150px', paddingLeft: '12px', marginLeft: '5px' },
    textVisible: { width: '150px', paddingLeft: '12px', marginLeft: '5px' },
    textHidden: { width: '58px', paddingLeft: '17px', marginLeft: '5px', transition: { duration: 0.5 } } 
};

const SMSLoginButton: FC<SMSLoginButtonProps> = ({ onClick, showText }) => {
    return (
        <motion.div
            className="gsi-material-button"
            onClick={onClick}
            initial="initial"
            animate={showText ? "textVisible" : "textHidden"}
            variants={buttonVariants}
            >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                        <SmsIcon />
                    </div>
                        {showText && (
                            <motion.div
                                key="text"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="gsi-material-button-text">
                                    Sign in with SMS
                                </div>
                            </motion.div>
                        )}
                </div>
        </motion.div>
    );
};

export default SMSLoginButton;
