import { gql, useQuery } from '@apollo/client';
import { useUser } from '../providers/UserProvider';
import { Typography } from '@mui/material';

interface WalletBallance {
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
    const { user } = useUser();
    if (user == null) {
        return <></>;
    }
    const { loading, error, data } = useQuery<WalletBalanceResponse, any>(
        GET_USER_WALLET_BALANCE,
        {
            variables: { account: user.account },
        },
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    if (!data) return <p>...</p>;

    return (
        <Typography variant="h3" style={{ marginTop: 16 }}>
            ${data.userWalletBalance.uiAmountString} USDC
        </Typography>
    );
}

export default Balance;