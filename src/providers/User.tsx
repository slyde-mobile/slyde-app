import { PublicKey } from '@solana/web3.js';
import ISNSAccount from '../types/snsAccount';
import { USDC_MINT } from '../util/solanaRPC';
import { getAssociatedTokenAddress } from '@solana/spl-token';

export interface IUser {
    populateSNSAccount(): Promise<void>;
    sns: string | null;
    emailAddress: string | null;
    account: string;
    verifier: string | null;
    verifierId: string | null;
    name: string | null;
    lastLogin: Date;
    snsAccount: ISNSAccount | null;
}

export class User implements IUser {
    public sns: string | null;
    public emailAddress: string | null;
    public account: string;
    public verifier: string | null;
    public verifierId: string | null;
    public name: string | null;
    public lastLogin: Date;
    public snsAccount: ISNSAccount | null;

    constructor(
        sns: string | null,
        emailAddress: string | null,
        account: string,
        verifier: string | null,
        verifierId: string | null,
        name: string | null,
        lastLogin: Date,
    ) {
        this.sns = sns;
        this.emailAddress = emailAddress;
        this.account = account;
        this.verifier = verifier;
        this.verifierId = verifierId;
        this.name = name;
        this.lastLogin = lastLogin;
        this.snsAccount = null;
    }

    public async populateSNSAccount(): Promise<void> {
        if (!this.sns) {
            throw new Error('SNS account not set');
        }
        const accountPk = new PublicKey(this.account);
        const usdcTokenAccount = await getAssociatedTokenAddress(
            USDC_MINT,
            accountPk,
        );
        this.snsAccount = {
            snsName: this.sns,
            account: accountPk,
            usdcAccount: usdcTokenAccount,
        };
    }
}
