import React from 'react';
import { Typography, ListItemButton, Divider, IconButton } from '@mui/material';
import { ITransaction } from '../types/ITransaction';
import { formatAccount, formatDate } from '../util/util';
import { ActionTypes, useGlobalState } from '../providers/GlobalStateProvider';
import { Page } from './PageSelector';
import ReceiveIcon from './ReceiveIcon';
import SendIcon from './SendIcon';

export function TransactionHistoryItem({
    transaction,
}: {
    transaction: ITransaction;
}) {
    const { dispatch } = useGlobalState();

    const loadTransactionPage = (transaction: ITransaction) => {
        dispatch({
            type: ActionTypes.SetCurrentPage,
            payload: { page: Page.TransactionDetail, object: transaction },
        });
    };

    return (
        <React.Fragment>
            <ListItemButton onClick={() => loadTransactionPage(transaction)}>
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
                                transaction.instructions[0]?.direction ===
                                'received'
                                    ? 'primary.main'
                                    : 'primary.main',
                        }}
                    >
                        {transaction.instructions[0]?.direction ===
                        'received' ? (
                            <ReceiveIcon />
                        ) : (
                            <SendIcon />
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
                    <Typography variant="body2">{transaction.memo}</Typography>
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
                            transaction.instructions[0]?.direction ===
                            'received'
                                ? 'success.main'
                                : 'error'
                        }
                    >
                        {transaction.instructions[0]?.direction === 'received'
                            ? '+'
                            : '-'}
                        ${transaction.instructions[0].uiAmountString}
                    </Typography>
                    <Typography variant="body2">
                        {formatDate(new Date(transaction.createdAt))}
                    </Typography>
                    <Typography variant="body2">
                        {transaction.rollup && transaction.rollup.toSns
                            ? transaction.instructions[0].direction ===
                              'received'
                                ? 'From: @' +
                                  formatAccount(
                                      transaction.rollup.fromSns.split('.')[0],
                                  )
                                : 'To: @' +
                                  formatAccount(
                                      transaction.rollup.toSns.split('.')[0],
                                  )
                            : ''}
                    </Typography>
                    {transaction.instructions[1] && (
                        <Typography variant="body2" style={{ display: 'none' }}>
                            Transaction fee: $
                            {transaction.instructions[1].uiAmountString}
                        </Typography>
                    )}
                </div>
            </ListItemButton>
            <Divider
                sx={{
                    borderColor: '#813ef9',
                    my: 2,
                    margin: '7px 14px 7px 14px',
                }}
            />
        </React.Fragment>
    );
}

export default TransactionHistoryItem;
