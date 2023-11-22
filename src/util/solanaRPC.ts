import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';
import {
    createTransferInstruction,
    getAssociatedTokenAddress,
    getAccount,
    createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';
import { Buffer } from 'buffer/';
import { resolve } from '@bonfida/spl-name-service';
import { CustomChainConfig, IProvider } from '@web3auth/base';
import { SolanaWallet } from '@web3auth/solana-provider';
import ISnsAccount from '../types/snsAccount';

const USDC_MINT = new PublicKey(import.meta.env.VITE_USDC_MINT_ADDRESS); // USDC mainnet Circle mint
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

    getConnection = async (): Promise<Connection> => {
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

    getUSDCProgramAddressForWallet = (walletAddress: String): PublicKey => {
        const OWNER = new PublicKey(walletAddress);

        const [address] = PublicKey.findProgramAddressSync(
            [
                OWNER.toBuffer(),
                TOKEN_PROGRAM_ID.toBuffer(),
                USDC_MINT.toBuffer(),
            ],
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

    signTransaction = async (
        transaction: Transaction,
    ): Promise<Transaction> => {
        const solanaWallet = new SolanaWallet(this.provider);
        return solanaWallet.signTransaction(transaction);
    };

    getSnsAccountForSubdomain = async (
        subdomain: string,
    ): Promise<ISnsAccount | null> => {
        if (subdomain.indexOf('.') === -1) {
            subdomain = subdomain + '.' + import.meta.env.VITE_SNS_PARENT_DOMAIN;
        }
        const subdomainAccount = await this.getAddressForSubdomain(subdomain);
        if (!subdomainAccount) {
            return null;
        }
        const usdcTokenAccount = await getAssociatedTokenAddress(
            USDC_MINT,
            subdomainAccount,
        );

        return {
            snsName: subdomain,
            account: subdomainAccount,
            usdcAccount: usdcTokenAccount,
        };
    };

    // the from and to public keys should just be the accounts that are sending and receiving the USDC
    // not the token accounts for usdc
    // we will look those up or create them here
    generateUSDCSendTransaction = async (
        from: ISnsAccount,
        to: ISnsAccount,
        amount: number,
        memo: string,
    ): Promise<[Transaction, ISnsAccount, ISnsAccount]> => {
        const payer = new PublicKey(
            'Hep4fgJ8mvFTRNh3GRjD4fTgA3GnAP4XPtB2ULAzFHUu',
        );
        const conn = await this.getConnection();
        const { blockhash, lastValidBlockHeight } =
            await conn.getLatestBlockhash('finalized');

        const transaction = new Transaction({
            blockhash,
            feePayer: payer,
            lastValidBlockHeight,
        });

        // const fromTokenAddress = await getAssociatedTokenAddress(
        //     USDC_MINT,
        //     from,
        // );

        // const toTokenAddress = await getAssociatedTokenAddress(USDC_MINT, to);
        const feePayerTokenAddress = await getAssociatedTokenAddress(
            USDC_MINT,
            payer,
        );

        // Check if the receiver's token account exists
        // let toTokenAccount: Account
        try {
            await getAccount(
                conn,
                to.usdcAccount,
                'confirmed',
                TOKEN_PROGRAM_ID,
            );
        } catch (e) {
            // If the account does not exist, add the create account instruction to the transaction
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    payer,
                    to.usdcAccount,
                    to.account,
                    USDC_MINT,
                    TOKEN_PROGRAM_ID,
                    ASSOCIATED_TOKEN_PROGRAM_ID,
                ),
            );
        }

        transaction.add(
            createTransferInstruction(
                from.usdcAccount,
                to.usdcAccount,
                from.account,
                amount,
            ),
        );
        transaction.add(
            createTransferInstruction(
                from.usdcAccount,
                feePayerTokenAddress,
                from.account,
                20000,
            ),
        );

        transaction.add(
            new TransactionInstruction({
                keys: [
                    { pubkey: from.account, isSigner: true, isWritable: true },
                ],
                // @ts-ignore
                data: Buffer.from(memo, 'utf-8'),
                programId: new PublicKey(
                    'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
                ),
            }),
        );

        return [transaction, from, to];
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

    getAddressForSubdomain = async (
        subdomain: string,
    ): Promise<PublicKey | null> => {
        try {
            // Get the account key for the subdomain
            const conn = await this.getConnection();
            const accountKey = await resolve(conn, subdomain);
            return accountKey;
        } catch (error) {
            console.error('Failed to get address for subdomain:', error);
            return null;
        }
    };

    getPrivateKey = async (): Promise<string> => {
        const privateKey = await this.provider.request({
            method: 'solanaPrivateKey',
        });

        return privateKey as string;
    };
}
