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
import { useUser } from '../providers/UserProvider';
import { IUser } from '../providers/IUser';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import SolanaRpc from '../util/solanaRPC';

interface ClaimUsernameResponse {
    claimUsername: IUser;
}

const CLAIM_USERNAME = gql`
    mutation ClaimUsername($account: String, $sns: String) {
        claimUsername(account: $account, sns: $sns) {
            account
            sns
            verifier
            verifierId
        }
    }
`;

function ChooseUsername() {
    const [claiming, setClaiming] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { web3User, account, setUser } = useUser();

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
                const ret = await apolloClient.mutate<ClaimUsernameResponse>({
                    mutation: CLAIM_USERNAME,
                    variables: {
                        account,
                        sns: inputValue.trim(),
                    },
                });
                if (ret.data != null) {
                    const rpc = new SolanaRpc(web3Auth.provider);
                    // this errors b/c the the object is not typed. i'd love to just call ret.data.user on this but it errors
                    setUser(await ret.data.claimUsername.toUser(rpc));
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
                              import.meta.env.VITE_SNS_PARENT_DOMAIN +
                              ' name'
                            : 'Choose Username'}
                    </>
                </Box>
            </Button>
            {account && (
                <div style={{ display: 'none' }}>
                    <Typography variant="caption" color="textSecondary">
                        {account}
                    </Typography>
                </div>
            )}
        </div>
    );
}

export default ChooseUsername;
