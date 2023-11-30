import { gql, useQuery } from '@apollo/client';
import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { ActionTypes, useGlobalState } from '../providers/GlobalStateProvider';

export interface WalletBalance {
    account: string;
    amount: string;
    decimals: number;
    uiAmount: number;
    uiAmountString: string;
}

interface WalletBalanceResponse {
    userWalletBalance: WalletBalance;
}

const GET_USER_WALLET_BALANCE = gql`
    query UserWalletBalance($account: String) {
        userWalletBalance(account: $account) {
            amount
            uiAmount
            uiAmountString
        }
    }
`;

function Balance() {
    const { state, dispatch } = useGlobalState();
    const { user, userBalance } = state;
    if (user == null) {
        return <></>;
    }

    const { loading, error, data } = useQuery<WalletBalanceResponse, any>(
        GET_USER_WALLET_BALANCE,
        {
            variables: { account: user.snsAccount?.account },
        },
    );

    useEffect(() => {
        if (data && hasBalanceChanged(data.userWalletBalance, userBalance)) {
            dispatch({
                type: ActionTypes.SetUserBalance,
                payload: data.userWalletBalance,
            });
        }
    }, [data]);

    const hasBalanceChanged = (
        newBalance: WalletBalance,
        currentBalance: WalletBalance | null,
    ) => {
        if (!currentBalance) return true;
        return newBalance.amount !== currentBalance.amount;
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    if (!data) return <p>...</p>;

    return (
        <Typography variant="h4" align="left" sx={{ marginTop: 1.5 }}>
            ${data.userWalletBalance.uiAmountString}
        </Typography>
    );
}

export default Balance;
