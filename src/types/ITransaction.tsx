import { ITransactionInstruction } from './ITransactionInstruction';
import { ITransactionRollup } from './ITransactionRollup';

export interface ITransaction {
    createdAt: string;
    signature: string;
    instructions: ITransactionInstruction[];
    memo: string;
    rollup: ITransactionRollup;
}
