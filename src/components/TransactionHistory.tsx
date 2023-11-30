import { useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { Typography, List } from '@mui/material';
import { ITransaction } from '../types/ITransaction';
import { useGlobalState } from '../providers/GlobalStateProvider';
import TransactionHistoryItem from './TransactionHistoryItem';

interface TransactionHistoryResponse {
    userTransactionHistory: ITransaction[];
}

const GET_USER_TRANSACTION_HISTORY = gql`
    query UserTransactionHistory($account: String) {
        userTransactionHistory(account: $account) {
            createdAt
            signature
            memo
            instructions {
                from
                to
                amount
                uiAmount
                uiAmountString
                direction
            }
            rollup {
                signature
                blockHash
                fromSns
                fromAccount
                fromTokenAccount
                toSns
                toAccount
                toTokenAccount
                token
            }
        }
    }
`;

interface TransactionHistoryProps {
    account?: string; // The question mark makes the 'account' prop optional
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ account }) => {
    const { state } = useGlobalState();
    const { user, processingTransactionState } = state;

    const [getUserTransactionHistory, { loading, error, data }] = useLazyQuery<
        TransactionHistoryResponse,
        any
    >(GET_USER_TRANSACTION_HISTORY);

    useEffect(() => {
        if (account) {
            getUserTransactionHistory({
                variables: { account: account },
                fetchPolicy: 'cache-first',
            });
        } else if (user) {
            getUserTransactionHistory({
                variables: { account: user.snsAccount?.account },
                fetchPolicy:
                    processingTransactionState === 'completed'
                        ? 'network-only'
                        : 'cache-first',
            });
        }
    }, [processingTransactionState]);

    if (user == null) {
        return <></>;
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    if (!data) return <p>...</p>;

    return (
        <div>
            <Typography variant="subtitle1" align="left" sx={{ padding: 2 }}>
                Transaction History{' '}
                <span style={{ display: 'none' }}>
                    @{user?.snsAccount?.snsName}.
                    {import.meta.env.VITE_SNS_PARENT_DOMAIN}
                </span>
            </Typography>
            <List sx={{ marginBottom: 10 }}>
                {data.userTransactionHistory.map(
                    (transaction: ITransaction) => (
                        <TransactionHistoryItem
                            key={transaction.signature}
                            transaction={transaction}
                        />
                    ),
                )}
            </List>
        </div>
    );
};
export default TransactionHistory;
