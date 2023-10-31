import { gql, useQuery } from '@apollo/client';
import {
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import { useUser } from '../providers/UserProvider';

interface Transaction {
    from: string;
    to: string;
    amount: string;
    uiAmount: number;
    createdAt: string;
}

interface TransactionHistoryResponse {
    userTransactionHistory: Transaction[];
}


const GET_USER_TRANSACTION_HISTORY = gql`
query UserTransactionHistory($account: String) {
    userTransactionHistory(account: $account) {
      from
      to
      amount
      uiAmount
      createdAt
    }
  }`;


function TransactionHistory() {
    const { user } = useUser();
    console.log('user', user);
    if (user == null) {
        return (<></>);
    }
    const { loading, error, data } = useQuery<TransactionHistoryResponse, any>(GET_USER_TRANSACTION_HISTORY, {
        variables: { account: user.account },
    });
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    if (!data) return <p>...</p>;

    return (
        <List>
            {data.userTransactionHistory.map((transaction: Transaction) => (
            <>
                <ListItem>
                    <ListItemText primary="Received USD" secondary={`$${transaction.uiAmount}`} />
                    <Typography variant="caption">{transaction.from}</Typography>
                </ListItem>
                <Divider component="li" />                
            </>
            ))}
        </List>
    );
};
export default TransactionHistory;