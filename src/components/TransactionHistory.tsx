import React, { useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { Typography, List, ListItem, Divider, IconButton } from '@mui/material';
import { useUser } from '../providers/UserProvider';
import ArrowLeftwardIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowRightwardIcon from '@mui/icons-material/ArrowCircleRight';

interface ITransaction {
    createdAt: string;
    signature: string;
    instructions: ITransactionInstruction[];
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
            instructions {
                from
                to
                amount
                uiAmount
                uiAmountString
                direction
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

function formatAccount(account: string) {
    return `${account.substring(0, 5)}...${account.substring(
        account.length - 5,
        account.length,
    )}`;
}

function TransactionHistory() {
    const { user, processingTransactionState } = useUser();

    const [getUserTransactionHistory, { loading, error, data }] = useLazyQuery<
        TransactionHistoryResponse,
        any
    >(GET_USER_TRANSACTION_HISTORY);

    useEffect(() => {
        if (user) {
            console.log(
                'processingTransactionState: ',
                processingTransactionState,
            );
            getUserTransactionHistory({
                variables: { account: user.account },
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
        <List>
            {data.userTransactionHistory.map((transaction: ITransaction) => (
                <React.Fragment key={transaction.signature}>
                    <ListItem>
                        <div style={{ flex: 1 }}>
                            <Typography variant="body2">
                                {formatDate(new Date(transaction.createdAt))}
                            </Typography>
                            <Typography variant="body2">
                                from{' '}
                                {formatAccount(
                                    transaction.instructions[0].from,
                                )}{' '}
                                to{' '}
                                {formatAccount(transaction.instructions[0].to)}
                            </Typography>
                            {transaction.instructions[1] && (
                                <Typography variant="body2">
                                    Transaction fee: $
                                    {transaction.instructions[1].uiAmountString}
                                </Typography>
                            )}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}
                        >
                            <Typography
                                variant="h6"
                                color={
                                    transaction.instructions[0]?.direction ===
                                    'received'
                                        ? 'success'
                                        : 'error'
                                }
                            >
                                ${transaction.instructions[0].uiAmountString}
                            </Typography>
                            <IconButton
                                color={
                                    transaction.instructions[0]?.direction ===
                                    'received'
                                        ? 'success'
                                        : 'error'
                                }
                            >
                                {transaction.instructions[0]?.direction ===
                                'received' ? (
                                    <ArrowLeftwardIcon />
                                ) : (
                                    <ArrowRightwardIcon />
                                )}
                            </IconButton>
                        </div>
                    </ListItem>
                    <Divider component="li" />
                </React.Fragment>
            ))}
        </List>
    );
}
export default TransactionHistory;
