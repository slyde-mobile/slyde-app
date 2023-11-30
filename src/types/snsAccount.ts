import { PublicKey } from '@solana/web3.js';

type ISNSAccount = {
    snsName: string;
    account: PublicKey;
    usdcAccount: PublicKey;
};

export default ISNSAccount;
