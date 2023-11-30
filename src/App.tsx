import { useEffect, useState, useContext } from 'react';
import { getWeb3AuthPublicKey } from './util/util';
import RPC from './util/solanaRPC';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { ADAPTER_STATUS } from '@web3auth/base';
import LoggedIn from './pages/LoggedIn';
import LoggedOut from './pages/LoggedOut';
import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import './App.css';
import { ApolloContext, Web3AuthContext } from './providers/ClientsProvider';
import { User } from './providers/User';
import AppLoading from './pages/AppLoading';
import { AnimatePresence, motion } from 'framer-motion';
import { ActionTypes, useGlobalState } from './providers/GlobalStateProvider';

interface CreateUserResponse {
    createUser: User;
}

const CREATE_USER = gql`
    mutation CreateUser(
        $account: String!
        $emailAddress: String
        $name: String
        $verifierId: String
        $verifier: String
    ) {
        createUser(
            account: $account
            emailAddress: $emailAddress
            name: $name
            verifierId: $verifierId
            verifier: $verifier
        ) {
            account
            sns
            verifier
            verifierId
            emailAddress
            name
        }
    }
`;

function App() {
    const [loading, setLoading] = useState<boolean>(true);

    const { dispatch, state } = useGlobalState();

    const { web3User, appState } = state;

    const apolloClient: ApolloClient<NormalizedCacheObject> | undefined =
        useContext(ApolloContext);
    const web3Auth: Web3AuthNoModal | undefined = useContext(Web3AuthContext);

    const createOrLoginUser = async (account: string) => {
        if (
            account == '' ||
            apolloClient == null ||
            web3User == null ||
            web3Auth == null ||
            !web3Auth.provider
        ) {
            return;
        }
        const ret = await apolloClient.mutate<CreateUserResponse>({
            mutation: CREATE_USER,
            variables: {
                account,
                emailAddress: web3User?.email,
                name: web3User.name,
                profileImage: web3User.profileImage,
                verifierId: web3User.verifierId,
                verifier: web3User.verifier,
            },
        });
        if (ret.data) {
            const user = new User(
                ret.data.createUser.sns,
                ret.data.createUser.emailAddress,
                ret.data.createUser.account,
                ret.data.createUser.verifier,
                ret.data.createUser.verifierId,
                ret.data.createUser.name,
                new Date(),
            );
            await user.populateSNSAccount();
            dispatch({ type: ActionTypes.SetUser, payload: user });
        }
    };

    useEffect(() => {
        const init = async () => {
            // Ok to initialize the app we have to do a few things
            // 1. Initialize the web3auth object
            // 2. Once initialized, we can check if the user is already logged in
            // 3. If they are logged in lets get their information
            //    a. Web3Auth call: Get user info, especially the idToken jwt. we need this to verify our future calls.
            //    b. Local derivation: Derive the web3auth public key from the private key
            //    c. Web3Auth call: Get the solana addresses from the user
            //    d. Graphql: Get the user from the server. We can see if this user exists, or create one if they don't.
            if (web3Auth != null) {
                if (web3Auth.status == ADAPTER_STATUS.NOT_READY) {
                    dispatch({
                        type: ActionTypes.UpdateAppState,
                        payload: 'NOT_READY',
                    });
                } else if (
                    web3Auth.connected &&
                    (web3Auth.status == ADAPTER_STATUS.READY ||
                        web3Auth.status == ADAPTER_STATUS.CONNECTED)
                ) {
                    // LOGGED IN & READY
                    dispatch({
                        type: ActionTypes.SetWeb3AuthKey,
                        payload: await getWeb3AuthPublicKey(web3Auth),
                    });
                    dispatch({
                        type: ActionTypes.SetWeb3User,
                        payload: await web3Auth.getUserInfo(),
                    });
                    dispatch({
                        type: ActionTypes.UpdateAppState,
                        payload: 'CLIENTS_INITIALIZED',
                    });
                    if (web3Auth.provider) {
                        const rpc = new RPC(web3Auth.provider);
                        const accounts = await rpc.getAccounts();
                        await createOrLoginUser(accounts[0]);
                        dispatch({
                            type: ActionTypes.UpdateAppState,
                            payload: 'LOGGED_IN',
                        });
                        if (loading) {
                            setTimeout(() => {
                                setLoading(false);
                            }, 2000);
                        }
                    }
                } else if (
                    !web3Auth.connected &&
                    (web3Auth.status == ADAPTER_STATUS.READY ||
                        web3Auth.status == ADAPTER_STATUS.CONNECTED)
                ) {
                    // LOGGED OUT & READY
                    setLoading(false);
                    dispatch({
                        type: ActionTypes.UpdateAppState,
                        payload: 'CLIENTS_INITIALIZED',
                    });
                }
            }
        };
        init();
    }, [web3Auth, appState]);

    const ConditionalComponent = () => {
        return (
            <AnimatePresence mode="wait">
                {loading ||
                (appState !== 'LOGGED_IN_READY' &&
                    appState !== 'LOGGED_OUT_READY') ? (
                    <motion.div
                        initial={{ opacity: 1, x: 0 }}
                        key="loading"
                        style={{
                            zIndex: 1,
                        }}
                        exit={{
                            x: '-100%',
                            transition: {
                                delay: 1,
                                duration: 0.3,
                            },
                        }}
                    >
                        <AppLoading />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        key="content"
                    >
                        {appState === 'LOGGED_IN_READY' ? (
                            <LoggedIn />
                        ) : (
                            <LoggedOut />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        );
    };

    return (
        <>
            <ConditionalComponent />
        </>
    );
}

export default App;
