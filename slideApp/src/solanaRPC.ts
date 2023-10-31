import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    ParsedInstruction,
  } from "@solana/web3.js";
  import { CustomChainConfig, IProvider } from "@web3auth/base";
  import { SolanaWallet } from "@web3auth/solana-provider";
  
  export default class SolanaRpc {
    private provider: IProvider;
  
    constructor(provider: IProvider) {
      this.provider = provider;
    }
  
    getAccounts = async (): Promise<string[]> => {
      try {
        const solanaWallet = new SolanaWallet(this.provider);
        const acc = await solanaWallet.requestAccounts();
        return acc;
      } catch (error) {
        return error as string[];
      }
    };
  
    getBalance = async (): Promise<string> => {
      try {
        const solanaWallet = new SolanaWallet(this.provider);
        const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
          method: "solana_provider_config",
          params: [],
        });
        const conn = new Connection(connectionConfig.rpcTarget);
  
        const accounts = await solanaWallet.requestAccounts();
        const balance = await conn.getBalance(new PublicKey(accounts[0]));
        return balance.toString();
      } catch (error) {
        return error as string;
      }
    };

    getConnection = async (): Promise<Connection> =>  {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
        method: "solana_provider_config",
        params: [],
      });
      return new Connection(connectionConfig.rpcTarget);
    };

    getUSDCBalance = async (walletAddress: String) => {
      const conn = await this.getConnection();
      const info = await conn.getTokenAccountBalance(new PublicKey(this.getUSDCProgramAddressForWallet(walletAddress)));
      if (!info.value.uiAmount) throw new Error('No balance found');
      console.log('Balance (using Solana-Web3.js): ', info);
      return info.value.uiAmount;
    };

    getUSDCTransactions = async(walletAddress: String) => { 
      const conn = await this.getConnection();
      const pubKey = new PublicKey(this.getUSDCProgramAddressForWallet(walletAddress));
      let transactionList = await conn.getSignaturesForAddress(pubKey, {limit:10});

      let signatureList = transactionList.map(transaction=>transaction.signature);
      let transactionDetails = await conn.getParsedTransactions(signatureList, {maxSupportedTransactionVersion:0});

      transactionList.forEach((transaction, i) => {
        const date = transaction.blockTime ? new Date(transaction.blockTime*1000) : new Date();
        const ti = transactionDetails[i]?.transaction?.message?.instructions.filter(
          (ix) : ix is ParsedInstruction => { 
            return ix && 'parsed' in ix && ix.parsed && ix.parsed.type === 'transferChecked';
          }
        )[0];
        console.log(`Transaction No: ${i+1}`);
        console.log(`Signature: ${transaction.signature}`);
        console.log(`Time: ${date}`);
        console.log(`Status: ${transaction.confirmationStatus}`);
        console.log(`From: ${ti?.parsed.info.authority}`);
        console.log(`To: ${ti?.parsed.info.destination}`);
        console.log(`Amount: \$${ti?.parsed.info.tokenAmount.uiAmount}`);
        console.log(("-").repeat(20));
      });
    }

    getUSDCProgramAddressForWallet = (walletAddress: String): String => {
      const OWNER = new PublicKey(walletAddress);
      const MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');    // USDC mainnet Circle mint
      const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'); // USDC mainnet spl-token program id
      const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

      const [address] = PublicKey.findProgramAddressSync(
          [OWNER.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), MINT.toBuffer()],
          ASSOCIATED_TOKEN_PROGRAM_ID
      );
      return address.toBase58();
    }
  
    signMessage = async (): Promise<string> => {
      try {
        const solanaWallet = new SolanaWallet(this.provider);
        const msg = Buffer.from("Test Signing Message ", "utf8");
        const res = await solanaWallet.signMessage(msg);
        return res.toString();
      } catch (error) {
        return error as string;
      }
    };
  
    sendTransaction = async (): Promise<string> => {
      try {
        const solanaWallet = new SolanaWallet(this.provider);
  
        const accounts = await solanaWallet.requestAccounts();
  
        const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
          method: "solana_provider_config",
          params: [],
        });
        const connection = new Connection(connectionConfig.rpcTarget);
  
        const block = await connection.getLatestBlockhash("finalized");
  
        const TransactionInstruction = SystemProgram.transfer({
          fromPubkey: new PublicKey(accounts[0]),
          toPubkey: new PublicKey(accounts[0]),
          lamports: 0.01 * LAMPORTS_PER_SOL,
        });
  
        const transaction = new Transaction({
          blockhash: block.blockhash,
          lastValidBlockHeight: block.lastValidBlockHeight,
          feePayer: new PublicKey(accounts[0]),
        }).add(TransactionInstruction);
  
        const { signature } = await solanaWallet.signAndSendTransaction(
          transaction
        );
  
        return signature;
      } catch (error) {
        return error as string;
      }
    };
  
    signTransaction = async (): Promise<string> => {
      try {
        const solanaWallet = new SolanaWallet(this.provider);
        const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
          method: "solana_provider_config",
          params: [],
        });
        const conn = new Connection(connectionConfig.rpcTarget);
  
        const pubKey = await solanaWallet.requestAccounts();
        const { blockhash } = await conn.getRecentBlockhash("finalized");
        const TransactionInstruction = SystemProgram.transfer({
          fromPubkey: new PublicKey(pubKey[0]),
          toPubkey: new PublicKey(pubKey[0]),
          lamports: 0.01 * LAMPORTS_PER_SOL,
        });
        const transaction = new Transaction({
          recentBlockhash: blockhash,
          feePayer: new PublicKey(pubKey[0]),
        }).add(TransactionInstruction);
        const signedTx = await solanaWallet.signTransaction(transaction);
        return signedTx.signature?.toString() || "";
      } catch (error) {
        return error as string;
      }
    };
  
    getPrivateKey = async (): Promise<string> => {
      const privateKey = await this.provider.request({
        method: "solanaPrivateKey",
      });
  
      return privateKey as string;
    };
  }