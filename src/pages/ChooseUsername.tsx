import { useRef, useContext, useState } from 'react';
import {
    Button,
    InputAdornment,
    TextField,
    Typography,
    CircularProgress,
    Box,
} from '@mui/material';
import {
    ApolloClient,
    ApolloError,
    NormalizedCacheObject,
    gql,
} from '@apollo/client';
import { ApolloContext, Web3AuthContext } from '../providers/ClientsProvider';
import { User } from '../providers/User';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import SolanaRpc from '../util/solanaRPC';
import { ActionTypes, useGlobalState } from '../providers/GlobalStateProvider';

interface ClaimUsernameResponse {
    claimUsername: User;
}

const CLAIM_USERNAME = gql`
    mutation ClaimUsername($account: String, $sns: String) {
        claimUsername(account: $account, sns: $sns) {
            account
            sns
            verifier
            verifierId
            emailAddress
            name
        }
    }
`;

function ChooseUsername() {
    const [claiming, setClaiming] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { dispatch, state } = useGlobalState();
    const { web3User } = state;

    const inputRef = useRef<HTMLInputElement>();
    const apolloClient: ApolloClient<NormalizedCacheObject> | undefined =
        useContext(ApolloContext);
    const web3Auth: Web3AuthNoModal | undefined = useContext(Web3AuthContext);

    async function claimSNSDomainRequest() {
        if (claiming) {
            return;
        }
        if (
            apolloClient &&
            inputRef.current &&
            inputRef.current !== null &&
            web3User != null &&
            web3Auth?.provider
        ) {
            const inputValue = inputRef.current.value.toLowerCase();
            try {
                setError(null);
                setClaiming(true);
                const rpc = new SolanaRpc(web3Auth.provider);
                const accounts = await rpc.getAccounts();
                const ret = await apolloClient.mutate<ClaimUsernameResponse>({
                    mutation: CLAIM_USERNAME,
                    variables: {
                        account: accounts[0],
                        sns: inputValue.trim(),
                    },
                });
                if (ret.data != null) {
                    const user = new User(
                        ret.data.claimUsername.sns,
                        ret.data.claimUsername.emailAddress,
                        ret.data.claimUsername.account,
                        ret.data.claimUsername.verifier,
                        ret.data.claimUsername.verifierId,
                        ret.data.claimUsername.name,
                        new Date(),
                    );
                    await user.populateSNSAccount();
                    dispatch({ type: ActionTypes.SetUser, payload: user });
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
        <div style={{ marginTop: '64px', padding: '20px' }}>
            <Typography
                color="textPrimary"
                align="left"
                sx={{ marginBottom: 2 }}
            >
                Choose your slyde name. <br />
                You can give this name to your friends and use it to send and
                receive USDC.
            </Typography>
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
                    sx={!error ? { marginBottom: 2.75 } : {}}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Typography variant="h6" color="textSecondary">
                                    .{import.meta.env.VITE_SNS_PARENT_DOMAIN}
                                </Typography>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            <Button
                variant="contained"
                color="secondary"
                onClick={claimSNSDomainRequest}
                fullWidth
                style={{ marginBottom: '10px' }}
            >
                <Box
                    position="relative"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    {claiming ? (
                        <CircularProgress size={24} sx={{ marginRight: 2 }} />
                    ) : null}
                    <>
                        {claiming && inputRef && inputRef.current
                            ? 'Claiming ' +
                              inputRef.current.value.toLowerCase() +
                              '.' +
                              import.meta.env.VITE_SNS_PARENT_DOMAIN
                            : 'Choose Username'}
                    </>
                </Box>
            </Button>
        </div>
    );
}

export default ChooseUsername;
