import { useContext } from 'react';
import { Web3AuthContext } from '../providers/ClientsProvider';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { WALLET_ADAPTERS } from '@web3auth/base';
import AppLogo from '../components/AppLogo';
import GoogleLoginButton from '../components/GoogleLoginButton';

const LoggedOut = () => {
    const web3Auth: Web3AuthNoModal | undefined = useContext(Web3AuthContext);

    const loginWithGoogle = async () => {
        if (!web3Auth) {
            return;
        }
        await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
            loginProvider: 'google',
        });
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
                <GoogleLoginButton onClick={() => loginWithGoogle()} />
            </div>
        </div>
    );
};

export default LoggedOut;
