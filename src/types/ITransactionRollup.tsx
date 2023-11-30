export interface ITransactionRollup {
    signature: string;
    blockHash: string;
    fromSns: string;
    fromAccount: string;
    fromTokenAccount: string;
    toSns: string;
    toAccount: string;
    toTokenAccount: string;
    token: string;
}
