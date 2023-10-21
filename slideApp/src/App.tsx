import { useEffect, useState } from 'react'
import { Button } from '@mui/material';
import { uiConsole } from "./util";
import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme'
import {
  CHAIN_NAMESPACES,
  IProvider,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import LoggedIn from "./LoggedIn";
import './App.css'

const RPC_URL = import.meta.env.VITE_SOLANA_RPC_BASE_URL + '?api-key=' + import.meta.env.VITE_SOLANA_RPC_KEY;

function App() {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(
    null
  );
  const [loggedIn, setLoggedIn] = useState<boolean | null>(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize within useEffect()
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: import.meta.env.VITE_SOLANA_CHAIN_ID, // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
          rpcTarget: RPC_URL,
          displayName: "Solana Mainnet",
          blockExplorer: import.meta.env.VITE_SOLANA_BLOCK_EXPLORER,
          ticker: "SOL",
          tickerName: "Solana",
        };
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const web3auth = new Web3AuthNoModal({
          clientId: import.meta.env.VITE_WEB3_AUTHCLIENT_ID, 
          web3AuthNetwork: "sapphire_devnet", // Web3Auth Network
          chainConfig,
        });

        setWeb3auth(web3auth);

        const privateKeyProvider = new SolanaPrivateKeyProvider({ config: { chainConfig } });

        const openloginAdapter = new OpenloginAdapter({
          privateKeyProvider
        });

        web3auth.configureAdapter(openloginAdapter);
        await web3auth.init();

        setProvider(web3auth.provider);
        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [loggedIn]);

  const loginWithGoogle = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: "google",
    });

    setProvider(web3authProvider);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  const loggedOutView = (
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
  );

  const loggedInProps = {
    provider,
    web3auth,
    logoutFn:logout
  }

  const ConditionalComponent = ({ ...props }) => (
    loggedIn ? <LoggedIn {...props} /> : loggedOutView
  );
  

  return (
    <ThemeProvider theme={theme}>
      <div>{ConditionalComponent({ ...loggedInProps})}</div>
    </ThemeProvider>
  )
}

export default App
