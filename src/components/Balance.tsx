import { gql, useQuery } from '@apollo/client';
import { useUser } from '../providers/UserProvider';
import { Typography } from '@mui/material';
import { useEffect } from 'react';

export interface WalletBallance {
    account: string;
    amount: string;
    decimals: number;
    uiAmount: number;
    uiAmountString: string;
}

interface WalletBalanceResponse {
    userWalletBalance: WalletBallance;
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
    const { user, setUserBalance } = useUser();
    if (user == null) {
        return <></>;
    }

    const { loading, error, data } = useQuery<WalletBalanceResponse, any>(
        GET_USER_WALLET_BALANCE,
        {
            variables: { account: user.account },
        },
    );

    useEffect(() => {
        if (data) {
            setUserBalance(data.userWalletBalance);
        }
    }, [data]);

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
