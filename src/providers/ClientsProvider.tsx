import React, { useReducer, createContext, useEffect } from 'react';
import {
    ApolloClient,
    ApolloProvider,
    HttpLink,
    InMemoryCache,
    NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { createWeb3Auth } from '../util/util';
import { ADAPTER_EVENTS } from '@web3auth/base';
import { useUser } from './UserProvider';

export const ApolloContext = createContext<
    ApolloClient<NormalizedCacheObject> | undefined
>(undefined);
export const Web3AuthContext = createContext<Web3AuthNoModal | undefined>(
    undefined,
);

type ClientsProviderProps = {
    onConnecting: () => void;
    onConnected: () => void;
};

// Define the shape of your state
interface ClientsState {
    apolloClient?: ApolloClient<NormalizedCacheObject>;
    web3Auth?: Web3AuthNoModal;
}

type ClientsAction =
    | { type: 'setApolloClient'; payload: ApolloClient<NormalizedCacheObject> }
    | { type: 'setWeb3Auth'; payload: Web3AuthNoModal };

const clientsReducer = (
    state: ClientsState,
    action: ClientsAction,
): ClientsState => {
    switch (action.type) {
        case 'setApolloClient':
            return { ...state, apolloClient: action.payload };
        case 'setWeb3Auth':
            return { ...state, web3Auth: action.payload };
        default:
            throw new Error('Unknown action type');
    }
};

export const ClientsProvider: React.FC<
    React.PropsWithChildren<ClientsProviderProps>
> = ({ children, onConnecting, onConnected }) => {
    const [state, dispatch] = useReducer(clientsReducer, {});
    const initializedRef = React.useRef<boolean>(false);
    const { web3AuthKey, web3User, updateAppReady, loggedIn, setLoggedIn } =
        useUser();

    const httpLink = new HttpLink({
        uri: import.meta.env.VITE_GRAPHQL_SERVER_URL,
    });

    useEffect(() => {
        const initializeProviders = async () => {
            if (!initializedRef.current) {
                initializedRef.current = true;
                const apolloClient = new ApolloClient({
                    link: httpLink,
                    cache: new InMemoryCache(),
                });

                const web3Auth = createWeb3Auth();
                web3Auth.on(ADAPTER_EVENTS.CONNECTED, async () => {
                    onConnected();
                    setLoggedIn(true);
                });
                web3Auth.on(ADAPTER_EVENTS.CONNECTING, () => {
                    onConnecting();
                });
                web3Auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
                    console.log('error', error);
                });
                web3Auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
                    console.log('error', error);
                });
                await web3Auth.init();

                dispatch({ type: 'setApolloClient', payload: apolloClient });
                dispatch({ type: 'setWeb3Auth', payload: web3Auth });
            }
        };
        initializeProviders();
    }, []);

    useEffect(() => {
        const updateApolloClient = async () => {
            const authLink = setContext((_, { headers }) => {
                // Get the authentication token and public key from the context

                const token = web3User?.idToken;
                const publicKey = web3AuthKey;
                // Return the headers to the context so httpLink can read them
                const headersReturn = {
                    ...headers,
                    ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add Authorization header if token is present
                    ...(publicKey ? { 'X-Public-Key': publicKey } : {}), // Add X-Public-Key header if publicKey is present
                };

                return {
                    headers: headersReturn,
                };
            });
            const newApolloClient = new ApolloClient({
                link: authLink.concat(httpLink),
                cache: new InMemoryCache(),
            });
            state.apolloClient?.setLink(authLink.concat(httpLink));
            dispatch({ type: 'setApolloClient', payload: newApolloClient });
        };
        if (web3AuthKey && web3AuthKey != '') {
            updateApolloClient();
        }
    }, [web3AuthKey]);

    // This useEffect will run whenever state.apolloClient or state.web3Auth changes
    useEffect(() => {
        if (
            web3AuthKey != null &&
            web3AuthKey != '' &&
            state.apolloClient != null &&
            state.web3Auth != null &&
            state.web3Auth.connected
        ) {
            updateAppReady({ clientsInitialized: true, authTokensReady: true });
        }
    }, [state.apolloClient, state.web3Auth, loggedIn]);

    return (
        <ApolloContext.Provider value={state.apolloClient}>
            <Web3AuthContext.Provider value={state.web3Auth}>
                {state.apolloClient ? (
                    <ApolloProvider client={state.apolloClient}>
                        {children}
                    </ApolloProvider>
                ) : (
                    children
                )}
            </Web3AuthContext.Provider>
        </ApolloContext.Provider>
    );
};
