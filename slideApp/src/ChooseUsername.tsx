import { useRef, useContext, useState } from 'react';
import {
    Button,
    InputAdornment,
    TextField,
    Typography,
    CircularProgress,
} from '@mui/material';
import {
    ApolloClient,
    ApolloError,
    NormalizedCacheObject,
    gql,
} from '@apollo/client';
import { ApolloContext } from './providers/ClientsProvider';
import { User, useUser } from './providers/UserProvider';

interface ClaimUsernameResponse {
    claimUsername: User;
}

const CLAIM_USERNAME = gql`
    mutation ClaimUsername(
        $idToken: String
        $web3AuthPublicKey: String
        $account: String
        $sns: String
    ) {
        claimUsername(
            idToken: $idToken
            web3AuthPublicKey: $web3AuthPublicKey
            account: $account
            sns: $sns
        ) {
            account
            sns
        }
    }
`;

function ChooseUsername() {
    const [claiming, setClaiming] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { web3User, account, web3AuthKey, setUser } = useUser();

    const inputRef = useRef<HTMLInputElement>();
    const apolloClient: ApolloClient<NormalizedCacheObject> | undefined =
        useContext(ApolloContext);

    async function claimSNSDomainRequest() {
        if (
            apolloClient &&
            inputRef.current &&
            inputRef.current !== null &&
            web3User != null
        ) {
            const inputValue = inputRef.current.value;
            try {
                setError(null);
                setClaiming(true);
                const ret = await apolloClient.mutate<ClaimUsernameResponse>({
                    mutation: CLAIM_USERNAME,
                    variables: {
                        idToken: web3User.idToken,
                        web3AuthPublicKey: web3AuthKey,
                        account,
                        sns: inputValue.trim(),
                    },
                });
                console.log(ret); // log the response to console
                if (ret.data != null) {
                    // this errors b/c the the object is not typed. i'd love to just call ret.data.user on this but it errors
                    setUser(ret.data.claimUsername);
                }
            } catch (error) {
                if (error instanceof ApolloError) {
                    setError(error.message);
                } else {
                    setError('Something went wrong.');
                }
            }
            setClaiming(false);
        }
    }

    return (
        <>
            <h3>logo</h3>
            <h1>Slyde</h1>
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
                        label={error ? 'Error' : ''}
                        placeholder="Enter your username"
                        color="secondary"
                        inputRef={inputRef}
                        error={!!error}
                        helperText={error}
                        inputProps={{ style: { color: 'white' } }}
                        InputProps={{
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

                <Button
                    disabled={claiming}
                    variant="contained"
                    color="secondary"
                    onClick={claimSNSDomainRequest}
                    fullWidth
                    style={{ marginBottom: '10px' }}
                >
                    {claiming ? (
                        <CircularProgress size={24} />
                    ) : (
                        'Choose Username'
                    )}
                </Button>
                {account && (
                    <div>
                        <Typography variant="caption" color="textSecondary">
                            {account}
                        </Typography>
                    </div>
                )}
            </div>
        </>
    );
}

export default ChooseUsername;
