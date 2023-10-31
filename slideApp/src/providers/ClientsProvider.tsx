import React, { useReducer, createContext, useEffect } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { createWeb3Auth } from "../util";
import {
    ADAPTER_EVENTS, 
  } from "@web3auth/base";

  export const ApolloContext = createContext<ApolloClient<NormalizedCacheObject> | undefined>(undefined);
  export const Web3AuthContext = createContext<Web3AuthNoModal | undefined>(undefined);

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

const clientsReducer = (state: ClientsState, action: ClientsAction): ClientsState => {
    switch(action.type) {
      case 'setApolloClient':
        return { ...state, apolloClient: action.payload };
      case 'setWeb3Auth':
        return { ...state, web3Auth: action.payload };
      default:
        throw new Error('Unknown action type');
    }
  };
  
  export const ClientsProvider : React.FC<React.PropsWithChildren<ClientsProviderProps>> = ({ children, onConnecting, onConnected  }) => {
    const [state, dispatch] = useReducer(clientsReducer, {});
  
    useEffect(() => {
        const init = async () => {
            const apolloClient = new ApolloClient({
                uri: 'http://127.0.0.1:8080/graphql',
                cache: new InMemoryCache(),
              });
          
            const web3Auth = createWeb3Auth();
            web3Auth.on(ADAPTER_EVENTS.CONNECTED, async () => { 
                onConnected();
            });
            web3Auth.on(ADAPTER_EVENTS.CONNECTING, () => {
                onConnecting();
            });
            web3Auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
                console.log("error", error);
            });
            web3Auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
                console.log("error", error);
            });    
            await web3Auth.init();
          
            dispatch({ type: 'setApolloClient', payload: apolloClient });
            dispatch({ type: 'setWeb3Auth', payload: web3Auth });
        };
        init();
    }, []);
  
    
    return (
      <ApolloContext.Provider value={state.apolloClient}>
        <Web3AuthContext.Provider value={state.web3Auth}>
          {state.apolloClient ? (<ApolloProvider client={state.apolloClient}>
                {children}
          </ApolloProvider>) : children}
        </Web3AuthContext.Provider>
      </ApolloContext.Provider>
    );
  };