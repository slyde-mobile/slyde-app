import { useEffect, useState, useContext } from 'react';
import { getWeb3AuthPublicKey } from './util/util';
import RPC from './util/solanaRPC';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { ADAPTER_STATUS } from '@web3auth/base';
import LoggedIn from './LoggedIn';
import LoggedOut from './LoggedOut';
import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import './App.css';
import { ApolloContext, Web3AuthContext } from './providers/ClientsProvider';
import { User, useUser } from './providers/UserProvider';

interface CreateUserResponse {
    createUser: User;
}

const CREATE_USER = gql`
    mutation CreateUser(
        $idToken: String
        $web3AuthPublicKey: String
        $account: String
        $emailAddress: String!
    ) {
        createUser(
            idToken: $idToken
            web3AuthPublicKey: $web3AuthPublicKey
            account: $account
            emailAddress: $emailAddress
        ) {
            account
            sns
        }
    }
`;

function App() {
    const [loading, setLoading] = useState<boolean>(false);
    const [web3authInitialized, setWeb3authInitialized] =
        useState<boolean>(false);

    const {
        web3User,
        loggedIn,
        account,
        web3AuthKey,
        setUser,
        setWeb3User,
        setLoggedIn,
        setAccount,
        setWeb3AuthKey,
    } = useUser();

    const apolloClient: ApolloClient<NormalizedCacheObject> | undefined =
        useContext(ApolloContext);
    const web3Auth: Web3AuthNoModal | undefined = useContext(Web3AuthContext);

    const createOrLoginUser = async () => {
        if (account == '' || apolloClient == null || web3User == null) {
            return;
        }

        const ret = await apolloClient.mutate<CreateUserResponse>({
            mutation: CREATE_USER,
            variables: {
                idToken: web3User.idToken,
                web3AuthPublicKey: web3AuthKey,
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
                web3Auth != null &&
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

                if (account == '') {
                    const rpc = new RPC(web3Auth.provider);
                    const accounts = await rpc.getAccounts();
                    setAccount(accounts[0]);
                } else {
                    await createOrLoginUser();
                    setLoggedIn(true);
                    setLoading(false);
                }
            }
        };
        init();
    }, [web3Auth, loggedIn, account, web3User, web3authInitialized]);

    // const logout = async () => {
    //   if (!web3Auth) {
    //     return;
    //   }
    //   await web3Auth.logout();
    //   setLoggedIn(false);
    //   setLoading(false);
    // };

    const loggedInProps = {};

    const ConditionalComponent = ({ ...props }) => {
        if (loading) {
            return <div>Loading...</div>;
        }
        return loggedIn ? <LoggedIn {...props} /> : <LoggedOut {...props} />;
    };

    return (
        <>
            <ConditionalComponent {...loggedInProps} />
        </>
    );
}

export default App;
