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
import { gql, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import SearchBySNS from './SearchBySns';
import { IUser } from '../providers/IUser';


export type SelectUserEvent = {
    user: IUser | null;
    sns: string;
    event: string;
};


const SIGN_TRANSACTION = gql`
    mutation SendMoney($serializedTransaction: [Int!]!, $blockHash: String!, $fromSnsName: String, $fromAccount: String, $fromTokenAccount: String, $toSnsName: String, $toAccount: String, $toTokenAccount: String, $token: String) {
        sendMoney(
            serializedTransaction: $serializedTransaction
            blockHash: $blockHash
            fromSnsName: $fromSnsName
            fromAccount: $fromAccount
            fromTokenAccount: $fromTokenAccount
            toSnsName: $toSnsName
            toAccount: $toAccount
            toTokenAccount: $toTokenAccount
            token: $token            
        ) {
            signature
        }
    }
`;

const containerVariants = {
    hidden: {
        y: '100vh', // Start above the screen
    },
    visible: {
        y: 0, // End at the natural position
        transition: {
            duration: 0.3, // Define how long the animation should take
            ease: 'linear', // Define the type of easing. Here it is linear.
        },
    },
    exit: {
        y: '100vh', // Exit off the bottom of the screen
        transition: {
            duration: 0.3, // Define how long the animation should take
            ease: 'linear', // Define the type of easing. Here it is linear.
        },
    },
};

function SendPrompt() {
    const [sending, setSending] = useState<boolean>(false);
    const [amountError, setAmountError] = useState<string | null>(null);
    const [memoError, setMemoError] = useState<string | null>(null);
    const [snsError, setSnsError] = useState<string | null>(null);
    const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
    const {
        account,
        user,
        userBalance,
        setProcessingTransactionState,
        setCurrentPage,
    } = useUser();

    const snsRef = useRef<HTMLInputElement>();
    const amountRef = useRef<HTMLInputElement>();
    const memoRef = useRef<HTMLInputElement>();

    const web3Auth: Web3AuthNoModal | undefined = useContext(Web3AuthContext);

    const [signTransaction] = useMutation(SIGN_TRANSACTION);

    // Event handler to show the search component
    const handleFocus = () => {
        setIsSearchVisible(true);
    };

    const handleSelectUser = (event: SelectUserEvent) => {
        setIsSearchVisible(false);
        if (event.user) {
            snsRef.current!.value = event.user.sns ? event.user.sns : '';
        } else {
            snsRef.current!.value = event.sns;
        }
    };


    const onSend = async () => {
        if (
            web3Auth == null ||
            web3Auth.provider == null ||
            user == null ||
        user.snsAccount == null ||
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
        setAmountError(null);

        if (snsRef.current?.value == null || snsRef.current?.value === '') {
            setSnsError('Please enter a username');
            return;
        }
        setSnsError(null);

        if (memoRef.current?.value == null || memoRef.current?.value === '') {
            setMemoError('Please enter a message');
            return;
        }
        setMemoError(null);

        // setSending(true);
        const rpc = new RPC(web3Auth.provider);
        const subdomain = snsRef.current?.value + '.slydedev.sol';
        const subdomainAccount = await rpc.getSnsAccountForSubdomain(subdomain);

        if (subdomainAccount == null) {
            setSnsError('Username not found');
            return;
        }
        setSnsError(null);

        const [txn, from, to] = await rpc.generateUSDCSendTransaction(
            user.snsAccount,
            subdomainAccount,
            amountInCents,
            memoRef.current?.value,
        );

        const signedTxn = await rpc.signTransaction(txn);

        const handleSignTransaction = async () => {
            setProcessingTransactionState('processing');
            setCurrentPage('dashboard');
            await signTransaction({
                variables: {
                    serializedTransaction: Array.from(
                        signedTxn.serialize({
                            requireAllSignatures: false,
                        }),
                    ),
                    blockHash: signedTxn.recentBlockhash,
                    fromSnsName: from.account,
                    fromAccount: from.account,
                    fromTokenAccount: from.usdcAccount,
                    toSnsName: to.snsName,
                    toAccount: to.account,
                    toTokenAccount: to.usdcAccount,
                    token: 'USDC',
                },
            });
            setProcessingTransactionState('completed');
        };

        await handleSignTransaction();
    };

    const snsWithoutDomain = user?.snsAccount?.snsName?.replace('.' + import.meta.env.VITE_SNS_PARENT_DOMAIN, '');

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
                margin: '21px 0px',
                position: 'fixed', // Fix position to the bottom of the screen
                top: 0,
                left: 0,
                bottom: 0,
                backgroundColor: '#0e1848', // Dark blue background
                right: 0, // Stretch across the full width of the screen
                zIndex: 100, // Make sure it's on top of other elements
                // Add additional styling as needed
            }}
        >
            {isSearchVisible && <SearchBySNS onSelect={handleSelectUser} value={snsRef.current!.value} />}
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
                            label="From"
                            value={snsWithoutDomain}
                            color="secondary"
                            inputProps={{ style: { color: 'white' } }}
                            contentEditable={false}
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
                                            .
                                            {
                                                import.meta.env
                                                    .VITE_SNS_PARENT_DOMAIN
                                            }
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
                            label={snsError ? 'Error' : 'Send Money To'}
                            placeholder="Enter username to send to"
                            color="secondary"
                            onFocus={handleFocus}
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
                                            .
                                            {
                                                import.meta.env
                                                    .VITE_SNS_PARENT_DOMAIN
                                            }
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
                            label={memoError ? 'Error' : 'Message'}
                            placeholder="Add a message (required)"
                            color="secondary"
                            inputRef={memoRef}
                            error={!!memoError}
                            helperText={memoError}
                            multiline
                            rows={4} // Adjust the number of rows as needed
                            style={{ marginBottom: '20px', color: 'white' }} // Adjust styling as needed
                            // Add any necessary props like inputRef, error, or helperText
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
                        <div style={{ display: 'none' }}>
                            <Typography variant="caption" color="textSecondary">
                                {account}
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default SendPrompt;
