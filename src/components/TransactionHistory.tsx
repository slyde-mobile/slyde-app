import React, { useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { Typography, List, ListItem, Divider, IconButton } from '@mui/material';
import { useUser } from '../providers/UserProvider';
import ArrowLeftwardIcon from '@mui/icons-material/Savings';
import ArrowRightwardIcon from '@mui/icons-material/Outbound';

interface ITransaction {
    createdAt: string;
    signature: string;
    instructions: ITransactionInstruction[];
    memo: string;
    rollup: ITransactionRollup;
}

interface ITransactionRollup {
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

interface ITransactionInstruction {
    from: string;
    to: string;
    amount: string;
    uiAmount: number;
    uiAmountString: string;
    direction: string;
}

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

function formatDate(date: Date) {
    const dateString = date.toLocaleDateString('en-US', {
        year: '2-digit',
        month: 'short',
        day: 'numeric',
    });
    const timeString = date
        .toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        })
        .toLowerCase();

    return `${dateString}, ${timeString}`;
}

// function formatAccount(account: string) {
//     return `${account.substring(0, 5)}...${account.substring(
//         account.length - 5,
//         account.length,
//     )}`;
// }

function TransactionHistory() {
    const { user, processingTransactionState } = useUser();

    const [getUserTransactionHistory, { loading, error, data }] = useLazyQuery<
        TransactionHistoryResponse,
        any
    >(GET_USER_TRANSACTION_HISTORY);

    useEffect(() => {
        if (user) {
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
                        <React.Fragment key={transaction.signature}>
                            <ListItem>
                                <div
                                    style={{
                                        flex: 1,
                                    }}
                                >
                                    <IconButton
                                        sx={{
                                            fontSize: '2rem',
                                            color: '#222',
                                            borderRadius: 0,
                                            backgroundColor:
                                                transaction.instructions[0]
                                                    ?.direction === 'received'
                                                    ? 'primary.main'
                                                    : 'primary.main',
                                        }}
                                    >
                                        {transaction.instructions[0]
                                            ?.direction === 'received' ? (
                                            <ArrowLeftwardIcon fontSize="inherit" />
                                        ) : (
                                            <ArrowRightwardIcon fontSize="inherit" />
                                        )}
                                    </IconButton>
                                </div>
                                <div
                                    style={{
                                        flex: 10,
                                        alignSelf: 'flex-start',
                                        padding: '0px 12px 6px 12px',
                                    }}
                                >
                                    <Typography variant="body2">
                                        {transaction.memo}
                                    </Typography>
                                </div>
                                <div
                                    style={{
                                        flex: 5,
                                        alignSelf: 'flex-start',
                                        textAlign: 'right',
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        color={
                                            transaction.instructions[0]
                                                ?.direction === 'received'
                                                ? 'success.main'
                                                : 'error'
                                        }
                                    >
                                        {transaction.instructions[0]
                                            ?.direction === 'received'
                                            ? '+'
                                            : '-'}
                                        $
                                        {
                                            transaction.instructions[0]
                                                .uiAmountString
                                        }
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatDate(
                                            new Date(transaction.createdAt),
                                        )}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                    >
                                        {
                                         transaction.rollup && transaction.rollup.toSns ? 
                                            transaction.instructions[0].direction === 'received' ?
                                            'From: @' + transaction.rollup.fromSns :
                                            'To: @' + transaction.rollup.toSns
                                            : ""                                       
                                        }
                                    </Typography>
                                    {transaction.instructions[1] && (
                                        <Typography
                                            variant="body2"
                                            style={{ display: 'none' }}
                                        >
                                            Transaction fee: $
                                            {
                                                transaction.instructions[1]
                                                    .uiAmountString
                                            }
                                        </Typography>
                                    )}
                                </div>
                            </ListItem>
                            <Divider
                                sx={{
                                    borderColor: '#813ef9',
                                    my: 2,
                                    margin: '7px 14px 7px 14px',
                                }}
                            />
                        </React.Fragment>
                    ),
                )}
            </List>
        </div>
    );
}
export default TransactionHistory;
