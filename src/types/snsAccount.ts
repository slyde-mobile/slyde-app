import { PublicKey } from '@solana/web3.js';

type ISnsAccount = {
    snsName: string;
    account: PublicKey;
    usdcAccount: PublicKey;
};

export default ISnsAccount;
