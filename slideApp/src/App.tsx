import { useEffect, useState } from 'react'
import { Button } from '@mui/material';
import {
  CHAIN_NAMESPACES,
  IProvider,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import RPC from "./solanaRPC"
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import './App.css'

function uiConsole(...args: any[]): void {
  const el = document.querySelector("#console>p");
  if (el) {
    el.innerHTML = JSON.stringify(args || {}, null, 2);
  }
}


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
  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
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

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    uiConsole(privateKey);
  };

  const loggedOutView = (
    <div className="card">
    <Button
      color="primary"
      size="large"
      onClick={() => loginWithGoogle()}
    >Login with Google Jamz</Button>
    <p>
      Edit <code>src/App.tsx</code> and save to test HMR
    </p>
  </div>
  );

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={getPrivateKey} className="card">
            Get Private Key
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}>Logged in Successfully!</p>
      </div>
    </>
  );

  return (
    <>
      <h3>logo</h3>
      <h1>Slyde</h1>
      <div>{loggedIn ? loggedInView : loggedOutView}</div>
      <p className="read-the-docs">
        Sup ducks
      </p>
    </>
  )
}

export default App
