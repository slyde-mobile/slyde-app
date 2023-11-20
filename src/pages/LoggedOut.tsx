import { SetStateAction, useContext, useState } from 'react';
import { Web3AuthContext } from '../providers/ClientsProvider';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { WALLET_ADAPTERS } from '@web3auth/base';
import AppLogo from '../components/AppLogo';
import GoogleLoginButton from '../components/GoogleLoginButton';
import SMSLoginButton from '../components/SMSLoginButton';
import { Box, TextField } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

const textFieldVariant = {
    initial: { x: -100, width: 0, opacity: 0 },
    animate: { x: 0, width: '240px', opacity: 1, transition: { duration: 0.5 } }
  };

const LoggedOut = () => {
    const web3Auth: Web3AuthNoModal | undefined = useContext(Web3AuthContext);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [smsLogin, setSMSLogin] = useState<boolean>(false);

    const validatePhoneNumber = (number: string) => {
        // Regular expression to check if phone number is in the format +{country-code}-{phone number}
        const regex = /^\+\d{1,3}-\d{1,15}$/;
        return regex.test(number);
      };
    
      const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setPhoneNumber(event.target.value);
        setIsValid(true);
      };

      const loginOrToggleSMS = async () => {
        if (smsLogin) {
            await loginWithSMS();
        } else {
            chooseSMSlogin();
        }
      }
    
      const loginWithSMS = async () => {
        if (validatePhoneNumber(phoneNumber)) {
            if (!web3Auth) {
                return;
            }
            await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
                loginProvider: 'sms_passwordless',
                extraLoginOptions: {
                    login_hint: phoneNumber,
                  },
            });
        } else {
          setIsValid(false);
        }
      };

    const loginWithGoogle = async () => {
        if (!web3Auth) {
            return;
        }
        await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
            loginProvider: 'google',
        });
    };

    const chooseSMSlogin = async () => {
        setSMSLogin(true);
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: '100vh', // vh stands for viewport height units
            }}
        >
            <AppLogo />
            <h1>Slyde</h1>
            <div className="card">                
                <AnimatePresence>                        
                    <Box display="flex" alignItems="flex-start">                            
                        {smsLogin ? (
                            <motion.div
                                initial="initial"
                                animate="animate"
                                variants={textFieldVariant}
                                key="loginWithSMS"
                            >
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    onChange={handleChange}
                                    label={!isValid ? 'Error' : 'Phone Number'}
                                    placeholder="+65-XXXXXXXX"
                                    color="secondary"
                                    value={phoneNumber}
                                    error={!isValid}
                                    helperText={!isValid && "Please enter a valid phone number: +{country-code}-{number}"}
                                    inputProps={{ style: { color: 'white' } }}                        
                                /> 
                            </motion.div>
                        ) : (
                            <GoogleLoginButton onClick={() => loginWithGoogle()} />
                        )}
                        <SMSLoginButton showText={!smsLogin} onClick={() => loginOrToggleSMS()} />
                    </Box>
                </AnimatePresence>  
            </div>
            <div className="card">
                
            </div>
        </div>
    );
};

export default LoggedOut;
