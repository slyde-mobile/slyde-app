export interface ITransactionInstruction {
    from: string;
    to: string;
    amount: string;
    uiAmount: number;
    uiAmountString: string;
    direction: string;
}
