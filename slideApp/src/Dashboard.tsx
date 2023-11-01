import { Typography, Button, Divider } from '@mui/material';
import { useUser } from './providers/UserProvider';
import TransactionHistory from './components/TransactionHistory';
import Balance from './components/Balance';
import RPC from './util/solanaRPC';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { useContext } from 'react';
import { Web3AuthContext } from './providers/ClientsProvider';
import { PublicKey } from '@solana/web3.js';
import { gql, useMutation } from '@apollo/client';

const SIGN_TRANSACTION = gql`
    mutation SendMoney($serializedTransaction: [Int!]!) {
        sendMoney(serializedTransaction: $serializedTransaction)
    }
`;

function Dashboard() {
    const { user, setCurrentPage } = useUser();
    const web3Auth: Web3AuthNoModal | undefined = useContext(Web3AuthContext);
    if (user == null) {
        return <></>;
    }

    const [signTransaction] = useMutation(SIGN_TRANSACTION);

    const onSend = async () => {
        if (web3Auth == null || web3Auth.provider == null) {
            return;
        }
        const rpc = new RPC(web3Auth.provider);
        const txn = await rpc.generateUSDCSendTransaction(
            new PublicKey(user.account),
            new PublicKey("B4dvdm1V5PipGHuwyM7u7ePeCftvk2DsxRa2jVG1iKTy"),
            100000
        );
        console.log('txn', txn);
        const signedTxn = await rpc.signTransaction(txn);
        // console.log(signedTxn.serialize());
        setCurrentPage('send');

        const handleSignTransaction = async () => {
            const response = await signTransaction({
                variables: {
                    serializedTransaction: Array.from(signedTxn.serialize({
                        requireAllSignatures: false,
                    })),
                },
            });
            console.log(response.data.signTransaction);
        };

        await handleSignTransaction();
    };

    return (
        <>
            <div style={{ padding: 16 }}>
                <Typography variant="h6">
                    <em>Quickly send USDC</em>
                </Typography>
                <Balance />
                <Typography variant="h6" style={{ marginBottom: 16 }}>
                    {user.sns}
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginBottom: 16 }}
                    onClick={onSend}
                >
                    Send USDC
                </Button>
            </div>

            <Divider />

            <TransactionHistory />
        </>
    );
}

export default Dashboard;
