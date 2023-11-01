import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    ParsedInstruction,
} from '@solana/web3.js';
import { createTransferInstruction, getAssociatedTokenAddress, getAccount, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { CustomChainConfig, IProvider } from '@web3auth/base';
import { SolanaWallet } from '@web3auth/solana-provider';

const USDC_MINT = new PublicKey(
    import.meta.env.VITE_USDC_MINT_ADDRESS,
); // USDC mainnet Circle mint
const TOKEN_PROGRAM_ID = new PublicKey(
    import.meta.env.VITE_USDC_TOKEN_PROGRAM_ID,
); // USDC mainnet spl-token program id
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
    import.meta.env.VITE_USDC_A_TOKEN_PROGRAM_ID,
);

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
            const connectionConfig = await solanaWallet.request<
                string[],
                CustomChainConfig
            >({
                method: 'solana_provider_config',
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

    getConnection = async (): Promise<Connection> => {
        console.log('provider', this.provider);
        const solanaWallet = new SolanaWallet(this.provider);
        const connectionConfig = await solanaWallet.request<
            string[],
            CustomChainConfig
        >({
            method: 'solana_provider_config',
            params: [],
        });
        return new Connection(connectionConfig.rpcTarget);
    };

    getUSDCBalance = async (walletAddress: String) => {
        const conn = await this.getConnection();
        const info = await conn.getTokenAccountBalance(this.getUSDCProgramAddressForWallet(walletAddress));
        if (!info.value.uiAmount) throw new Error('No balance found');
        console.log('Balance (using Solana-Web3.js): ', info);
        return info.value.uiAmount;
    };

    getUSDCTransactions = async (walletAddress: String) => {
        const conn = await this.getConnection();
        const pubKey = this.getUSDCProgramAddressForWallet(walletAddress);
        let transactionList = await conn.getSignaturesForAddress(pubKey, {
            limit: 10,
        });

        let signatureList = transactionList.map(
            (transaction) => transaction.signature,
        );
        let transactionDetails = await conn.getParsedTransactions(
            signatureList,
            { maxSupportedTransactionVersion: 0 },
        );

        transactionList.forEach((transaction, i) => {
            const date = transaction.blockTime
                ? new Date(transaction.blockTime * 1000)
                : new Date();
            const ti = transactionDetails[
                i
            ]?.transaction?.message?.instructions.filter(
                (ix): ix is ParsedInstruction => {
                    return (
                        ix &&
                        'parsed' in ix &&
                        ix.parsed &&
                        ix.parsed.type === 'transferChecked'
                    );
                },
            )[0];
            console.log(`Transaction No: ${i + 1}`);
            console.log(`Signature: ${transaction.signature}`);
            console.log(`Time: ${date}`);
            console.log(`Status: ${transaction.confirmationStatus}`);
            console.log(`From: ${ti?.parsed.info.authority}`);
            console.log(`To: ${ti?.parsed.info.destination}`);
            console.log(`Amount: \$${ti?.parsed.info.tokenAmount.uiAmount}`);
            console.log('-'.repeat(20));
        });
    };

    getUSDCProgramAddressForWallet = (walletAddress: String): PublicKey => {
        const OWNER = new PublicKey(walletAddress);

        const [address] = PublicKey.findProgramAddressSync(
            [OWNER.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), USDC_MINT.toBuffer()],
            ASSOCIATED_TOKEN_PROGRAM_ID,
        );
        return address;
    };

    signMessage = async (): Promise<string> => {
        try {
            const solanaWallet = new SolanaWallet(this.provider);
            const msg = Buffer.from('Test Signing Message ', 'utf8');
            const res = await solanaWallet.signMessage(msg);
            return res.toString();
        } catch (error) {
            return error as string;
        }
    };

    signTransaction = async (transaction : Transaction) : Promise<Transaction> => {
        const solanaWallet = new SolanaWallet(this.provider);
        return solanaWallet.signTransaction(transaction);
    }

    // the from and to public keys should just be the accounts that are sending and receiving the USDC
    // not the token accounts for usdc
    // we will look those up or create them here
    generateUSDCSendTransaction = async (from: PublicKey, to: PublicKey, amount: number): Promise<Transaction> => {
        const payer = new PublicKey("Hep4fgJ8mvFTRNh3GRjD4fTgA3GnAP4XPtB2ULAzFHUu");
        const conn = await this.getConnection();
        const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash('finalized');

        const transaction = new Transaction({
            blockhash,
            feePayer: payer, 
            lastValidBlockHeight
        });
        
        const fromTokenAddress = await getAssociatedTokenAddress(USDC_MINT, from);
        const toTokenAddress = await getAssociatedTokenAddress(USDC_MINT, to);
        const feePayerTokenAddress = await getAssociatedTokenAddress(USDC_MINT, payer);

        // Check if the receiver's token account exists
        // let toTokenAccount: Account
        try {
            await getAccount(
                conn,
                toTokenAddress,
                "confirmed",
                TOKEN_PROGRAM_ID
            );
        } catch (e) {
            // If the account does not exist, add the create account instruction to the transaction
            transaction.add(createAssociatedTokenAccountInstruction(
                payer,
                toTokenAddress,
                to,
                USDC_MINT,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
              ));
        }

        transaction.add(createTransferInstruction(fromTokenAddress, toTokenAddress, from, amount));
        transaction.add(createTransferInstruction(fromTokenAddress, feePayerTokenAddress, from, 20000));
        return transaction;
    };

    sendTransaction = async (): Promise<string> => {
        try {
            const solanaWallet = new SolanaWallet(this.provider);

            const accounts = await solanaWallet.requestAccounts();

            const connectionConfig = await solanaWallet.request<
                string[],
                CustomChainConfig
            >({
                method: 'solana_provider_config',
                params: [],
            });
            const connection = new Connection(connectionConfig.rpcTarget);

            const block = await connection.getLatestBlockhash('finalized');

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

            const { signature } =
                await solanaWallet.signAndSendTransaction(transaction);

            return signature;
        } catch (error) {
            return error as string;
        }
    };

    getPrivateKey = async (): Promise<string> => {
        const privateKey = await this.provider.request({
            method: 'solanaPrivateKey',
        });

        return privateKey as string;
    };
}
