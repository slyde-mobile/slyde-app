import { useContext } from 'react';
import { Button } from '@mui/material';
import { Web3AuthContext } from './providers/ClientsProvider';
import { Web3AuthNoModal } from "@web3auth/no-modal";
import {
    WALLET_ADAPTERS,
  } from "@web3auth/base";

const LoggedOut = () => {
    const web3Auth : Web3AuthNoModal | undefined = useContext(Web3AuthContext);

    const loginWithGoogle = async () => {
        if (!web3Auth) {
          return;
        }
        await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
          loginProvider: "google",
        });
    };
 
    return (
        <>
        <h3>logo</h3>
        <h1>Slyde</h1>
        <div className="card">
          <Button
            variant='contained'
            fullWidth={true}
            onClick={() => loginWithGoogle()}
          >Login with Google</Button>
        </div>
      </>
    )
}

export default LoggedOut;
