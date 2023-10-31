import {
  CHAIN_NAMESPACES,
  CustomChainConfig,
} from "@web3auth/base";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";
import { Buffer } from 'buffer/'
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Web3AuthNoModal } from "@web3auth/no-modal";

export function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

export function getChainConfig(): CustomChainConfig {
  const RPC_URL = 'https://evil-leann-fast-mainnet.helius-rpc.com/'; //import.meta.env.VITE_SOLANA_RPC_BASE_URL + '?api-key=' + import.meta.env.VITE_SOLANA_RPC_KEY;

  return {
    chainNamespace: CHAIN_NAMESPACES.SOLANA,
    chainId: import.meta.env.VITE_SOLANA_CHAIN_ID, // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
    rpcTarget: RPC_URL,
    displayName: "Solana Mainnet",
    blockExplorer: import.meta.env.VITE_SOLANA_BLOCK_EXPLORER,
    ticker: "SOL",
    tickerName: "Solana",
  };
};

export function createWeb3Auth() : Web3AuthNoModal {
  const chainConfig = getChainConfig();
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const web3auth = new Web3AuthNoModal({
    clientId: import.meta.env.VITE_WEB3_AUTHCLIENT_ID, 
    web3AuthNetwork: "sapphire_devnet", // Web3Auth Network
    chainConfig,
  });

  const privateKeyProvider = new SolanaPrivateKeyProvider({ config: { chainConfig } });

  const openloginAdapter = new OpenloginAdapter({
    privateKeyProvider
  });

  web3auth.configureAdapter(openloginAdapter);
  return web3auth;
}

export async function getWeb3AuthPublicKey(web3auth: Web3AuthNoModal) : Promise<string> {
  if (web3auth == null || web3auth.provider == null || !web3auth.connected) {
    return "";
  }

  const privateKey = await web3auth.provider.request<any, string>({
    method: "solanaPrivateKey"
  });

  if (!privateKey) {
    console.log("Private key not found");
    return "";
  }

  const hexPrivKey = Buffer.from(privateKey, "hex");
  // @ts-expect-error
  return getED25519Key(hexPrivKey).pk.toString('hex'); 
}