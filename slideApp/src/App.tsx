import { useEffect, useState } from 'react'
import { Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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
          chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
          rpcTarget: "https://rpc.helius.xyz/?api-key=fe3b26a1-a339-41b6-9448-4410f6c67216",
          displayName: "Solana Mainnet",
          blockExplorer: "https://explorer.solana.com",
          ticker: "SOL",
          tickerName: "Solana",
        };
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const web3auth = new Web3AuthNoModal({
          clientId: "BGsSfLD9Y8KSvwOxvZTKfZYsAFUaKU0sog5G7X-Bs7SWg9bSSgXMI4PYbT1S4zJM8ylXAffvT3YusA2fh0afyIs", // Get your Client ID from the Web3Auth Dashboard
          web3AuthNetwork: "sapphire_devnet", // Web3Auth Network
          chainConfig,
        });

        setWeb3auth(web3auth);

        const privateKeyProvider = new SolanaPrivateKeyProvider({ config: { chainConfig } });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            uxMode: "popup",
            loginConfig: {
              // Google login
              google: {
                verifier: "slyde", // Pass the Verifier name here
                typeOfLogin: "google", // Pass on the login provider of the verifier you've created
                clientId: "345754597602-8s1fodms1smf0rp19s42atht2bqmqq91.apps.googleusercontent.com", // Pass on the Google `Client ID` here
              },
            },
          },
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
  }, []);

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
    <div className="card">
    <Button
      variant='contained'
      fullWidth={true}
      onClick={() => loginWithGoogle()}
    >Login with Google</Button>
    <p>
      Edit <code>src/App.tsx</code> and save to test HMR
    </p>
  </div>
  );

  const loggedInProps = {
    provider,
    web3auth,
    logoutFn:logout
  }

  const ConditionalComponent = ({ ...props }) => (
    loggedIn ? <LoggedIn {...props} /> : loggedOutView
  );

  const theme = createTheme({
    palette: {
      primary: {
        main: '#fff',
        light: '#813ef9',
        dark: '#0e1848',
      },
      secondary: {
        main: '#f2b842',
      },
      background: {
        default: '#813ef9',
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: '#f2b842',
            borderColor: '#2d2d2d',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: 0,
            '&:hover': {
              backgroundColor: '#d9a534', // A slightly darker shade when hovered
            },
          },
        },
      },
    },
  });
  

  return (
    <ThemeProvider theme={theme}>
      <h3>logo</h3>
      <h1>Slyde</h1>
      <div>{ConditionalComponent({ ...loggedInProps})}</div>
      <p className="read-the-docs">
        Sup ducks
      </p>
    </ThemeProvider>
  )
}

export default App
