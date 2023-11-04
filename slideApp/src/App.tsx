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
import { User, useUser } from './providers/UserProvider';
import AppLoading from './pages/AppLoading';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface CreateUserResponse {
    createUser: User;
}

const CREATE_USER = gql`
    mutation CreateUser($account: String, $emailAddress: String!) {
        createUser(account: $account, emailAddress: $emailAddress) {
            account
            sns
        }
    }
`;

function App() {
    const [loading, setLoading] = useState<boolean>(true);
    const [web3authInitialized, setWeb3authInitialized] =
        useState<boolean>(false);

    const {
        web3User,
        loggedIn,
        account,
        appReady,
        setUser,
        setWeb3User,
        setLoggedIn,
        setAccount,
        setWeb3AuthKey,
    } = useUser();

    const apolloClient: ApolloClient<NormalizedCacheObject> | undefined =
        useContext(ApolloContext);
    const web3Auth: Web3AuthNoModal | undefined = useContext(Web3AuthContext);

    const createOrLoginUser = async (account: string) => {
        if (account == '' || apolloClient == null || web3User == null) {
            return;
        }
        const ret = await apolloClient.mutate<CreateUserResponse>({
            mutation: CREATE_USER,
            variables: {
                account,
                emailAddress: web3User.email,
                name: web3User.name,
                profileImage: web3User.profileImage,
            },
        });
        setUser(ret.data ? ret.data.createUser : null);
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
            if (
                web3Auth &&
                !web3authInitialized &&
                web3Auth.status == ADAPTER_STATUS.NOT_READY
            ) {
                setWeb3authInitialized(true);
            } else if (
                web3Auth != null &&
                web3Auth.connected &&
                web3Auth.provider
            ) {
                setWeb3authInitialized(true);
                setWeb3AuthKey(await getWeb3AuthPublicKey(web3Auth));

                const userInfo = await web3Auth.getUserInfo();
                setWeb3User(userInfo);
            } else if (
                web3Auth != null &&
                !web3Auth.connected &&
                web3Auth.status == ADAPTER_STATUS.READY
            ) {
                setWeb3authInitialized(true);
                setLoading(false);
            }
        };
        init();
    }, [web3Auth, web3authInitialized, loggedIn]);

    useEffect(() => {
        const initUser = async () => {
            if (
                web3User &&
                web3Auth &&
                web3Auth.connected &&
                web3Auth.provider &&
                account == ''
            ) {
                const rpc = new RPC(web3Auth.provider);
                const accounts = await rpc.getAccounts();
                setAccount(accounts[0]);

                await createOrLoginUser(accounts[0]);
                if (!loggedIn) {
                    setLoggedIn(true);
                }
                if (loading) {
                    setLoading(false);
                }
                console.log('User logged in');
            }
        };
        initUser();
    }, [web3User]);

    const loggedInProps = {};

    const ConditionalComponent = ({ ...props }) => {
        const [showLoading, setShowLoading] = React.useState<boolean>(true); // This is the state that will be used to show the loading screen

        useEffect(() => {
            if (!loading && showLoading) {
                const timeoutId = setTimeout(() => {
                    if (showLoading) {
                        setShowLoading(false);
                    }
                }, 2000); // Set showLoading to false after 2 seconds

                return () => clearTimeout(timeoutId); // Clear the timeout if the component unmounts
            }
        }, [loading]);

        return (
            <AnimatePresence mode="wait">
                {showLoading ? (
                    <motion.div
                        initial={{ opacity: 1, y: 0 }}
                        key="loading"
                        exit={{
                            y: '-100%',
                            transition: {
                                delay: 2, // Delay the slide up for 2 seconds
                                duration: 0.5,
                            },
                        }}
                    >
                        <AppLoading />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        key="content"
                    >
                        {loggedIn && appReady ? (
                            <LoggedIn {...props} />
                        ) : (
                            <LoggedOut {...props} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        );
    };

    return (
        <>
            <ConditionalComponent {...loggedInProps} />
        </>
    );
}

export default App;
