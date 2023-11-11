import { useRef, useState } from 'react';
import {
    Button,
    InputAdornment,
    TextField,
    Typography,
    CircularProgress,
} from '@mui/material';
import { useUser } from '../providers/UserProvider';
import RPC from '../util/solanaRPC';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { useContext } from 'react';
import { Web3AuthContext } from '../providers/ClientsProvider';
import { PublicKey } from '@solana/web3.js';
import { gql, useMutation } from '@apollo/client';

const SIGN_TRANSACTION = gql`
    mutation SendMoney($serializedTransaction: [Int!]!, $blockHash: String!) {
        sendMoney(
            serializedTransaction: $serializedTransaction
            blockHash: $blockHash
        ) {
            signature
        }
    }
`;

function SendPrompt() {
    const [sending, setSending] = useState<boolean>(false);
    const [amountError, setAmountError] = useState<string | null>(null);
    const [snsError, setSnsError] = useState<string | null>(null);
    const {
        account,
        user,
        userBalance,
        setProcessingTransactionState,
        setCurrentPage,
    } = useUser();

    const snsRef = useRef<HTMLInputElement>();
    const amountRef = useRef<HTMLInputElement>();

    const web3Auth: Web3AuthNoModal | undefined = useContext(Web3AuthContext);

    const [signTransaction] = useMutation(SIGN_TRANSACTION);

    const onSend = async () => {
        if (
            web3Auth == null ||
            web3Auth.provider == null ||
            user == null ||
            userBalance == null
        ) {
            return;
        }

        const amountString = amountRef.current?.value;

        if (!amountString) {
            setAmountError('Please enter an amount');
            setSending(false);
            return;
        }

        const amount = parseFloat(amountString);
        if (isNaN(amount) || amount <= 0) {
            setAmountError('Invalid amount. Please enter a valid number.');
            return;
        }

        // Convert to cents (assuming user inputs dollars)
        const amountInCents = Math.round(amount * 1000000);
        const userBalanceInCents = parseInt(userBalance.amount, 10);

        if (amountInCents > userBalanceInCents) {
            setAmountError('Insufficient balance');
            return;
        }

        if (snsRef.current?.value == null || snsRef.current?.value === '') {
            setSnsError('Please enter a username');
            return;
        }

        // setSending(true);
        const rpc = new RPC(web3Auth.provider);
        const subdomain = snsRef.current?.value + '.slydedev.sol';
        const subdomainAccount = await rpc.getAddressForSubdomain(subdomain);
        console.log(
            'subdomainAccount',
            subdomain,
            subdomainAccount?.toBase58(),
        );

        if (subdomainAccount == null) {
            setSnsError('Username not found');
            return;
        }

        const txn = await rpc.generateUSDCSendTransaction(
            new PublicKey(user.account),
            subdomainAccount,
            amountInCents,
        );

        const signedTxn = await rpc.signTransaction(txn);

        const handleSignTransaction = async () => {
            setProcessingTransactionState('processing');
            setCurrentPage('dashboard');
            const response = await signTransaction({
                variables: {
                    serializedTransaction: Array.from(
                        signedTxn.serialize({
                            requireAllSignatures: false,
                        }),
                    ),
                    blockHash: signedTxn.recentBlockhash,
                },
            });
            console.log(response.data.signTransaction);
            setProcessingTransactionState('completed');
        };

        await handleSignTransaction();
    };

    return (
        <div style={{ marginTop: '64px' }}>
            <div style={{ padding: '20px' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '20px',
                    }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        label={snsError ? 'Error' : 'Send Money To'}
                        placeholder="Enter username to send to"
                        color="secondary"
                        inputRef={snsRef}
                        error={!!snsError}
                        helperText={snsError}
                        inputProps={{ style: { color: 'white' } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Typography
                                        variant="h6"
                                        color="textSecondary"
                                    >
                                        &nbsp;
                                    </Typography>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Typography
                                        variant="h6"
                                        color="textSecondary"
                                    >
                                        .slyde
                                    </Typography>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '20px',
                    }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        label={amountError ? 'Error' : 'Amount'}
                        placeholder="100"
                        color="secondary"
                        type="number"
                        inputRef={amountRef}
                        error={!!amountError}
                        helperText={amountError}
                        inputProps={{ style: { color: 'white' } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Typography
                                        variant="h6"
                                        color="textSecondary"
                                    >
                                        $
                                    </Typography>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Typography
                                        variant="h6"
                                        color="textSecondary"
                                    >
                                        USDC
                                    </Typography>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>

                <Button
                    disabled={sending}
                    variant="contained"
                    color="secondary"
                    onClick={onSend}
                    fullWidth
                    style={{ marginBottom: '10px' }}
                >
                    {sending ? <CircularProgress size={24} /> : 'Send USDC'}
                </Button>
                {account && (
                    <div>
                        <Typography variant="caption" color="textSecondary">
                            {account}
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SendPrompt;
