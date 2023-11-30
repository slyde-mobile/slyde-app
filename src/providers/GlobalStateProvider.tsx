import React, { createContext, useContext, useReducer } from 'react';
import { OpenloginUserInfo } from '@web3auth/openlogin-adapter';
import { WalletBalance } from '../components/Balance';
import { User } from './User';
import { updateAppReadyState } from '../types/AppState';
import { ITransaction } from '../types/ITransaction';
import { Page } from '../components/PageSelector';

interface GlobalState {
    user: User | null;
    web3User: Partial<OpenloginUserInfo> | null;
    userBalance: WalletBalance | null;
    web3AuthKey: string;

    transactionDetail: ITransaction | null;
    userProfileAccount: string | null;

    appState: string;
    currentPage: Page;

    processingTransactionState: string; //TODO: make this better / more extensible
}

const initialState: GlobalState = {
    user: null,
    web3User: null,
    web3AuthKey: '',
    currentPage: Page.Dashboard,
    userBalance: null,
    processingTransactionState: 'not_started',
    appState: 'LOGGED_OUT_NOT_READY',
    transactionDetail: null,
    userProfileAccount: null,
};

export enum ActionTypes {
    SetUser = 'SET_USER',
    SetWeb3User = 'SET_WEB3_USER',
    SetWeb3AuthKey = 'SET_WEB3_AUTH_KEY',
    SetCurrentPage = 'SET_CURRENT_PAGE',
    UpdateAppState = 'UPDATE_APP_STATE',
    SetUserBalance = 'SET_USER_BALANCE',
    SetTransactionState = 'SET_TRANSACTION_STATE',
}

type ActionType =
    | { type: ActionTypes.SetUser; payload: User | null }
    | {
          type: ActionTypes.SetWeb3User;
          payload: Partial<OpenloginUserInfo> | null;
      }
    | { type: ActionTypes.SetWeb3AuthKey; payload: string }
    | {
          type: ActionTypes.SetCurrentPage;
          payload: { page: Page; object: string | ITransaction | null };
      }
    | { type: ActionTypes.UpdateAppState; payload: string }
    | { type: ActionTypes.SetUserBalance; payload: WalletBalance | null }
    | { type: ActionTypes.SetTransactionState; payload: string };

const globalStateReducer = (
    state: GlobalState,
    action: ActionType,
): GlobalState => {
    console.log('globalStateReducer', action);
    switch (action.type) {
        case ActionTypes.SetUser:
            return { ...state, user: action.payload };
        case ActionTypes.SetWeb3User:
            return { ...state, web3User: action.payload };
        case ActionTypes.SetWeb3AuthKey:
            return { ...state, web3AuthKey: action.payload };
        case ActionTypes.SetCurrentPage:
            switch (action.payload.page) {
                case Page.TransactionDetail:
                    return {
                        ...state,
                        currentPage: action.payload.page,
                        transactionDetail: action.payload
                            .object as ITransaction,
                    };
                case Page.UserProfile:
                    return {
                        ...state,
                        currentPage: action.payload.page,
                        userProfileAccount: action.payload.object as string,
                    };
            }
            return { ...state, currentPage: action.payload.page };
        case ActionTypes.SetUserBalance:
            return { ...state, userBalance: action.payload };
        case ActionTypes.SetTransactionState:
            return { ...state, processingTransactionState: action.payload };
        case ActionTypes.UpdateAppState:
            return {
                ...state,
                appState: updateAppReadyState(action.payload, state.appState),
            };
        default:
            return state;
    }
};

const GlobalStateContext = createContext<{
    state: GlobalState;
    dispatch: React.Dispatch<ActionType>;
}>({
    state: initialState,
    dispatch: () => null,
});

// Create the GlobalStateProvider component
export const GlobalStateProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(globalStateReducer, initialState);

    return (
        <GlobalStateContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

// Create a custom hook for accessing the global state and dispatch function
export const useGlobalState = () => {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error(
            'useGlobalState must be used within a GlobalStateProvider',
        );
    }
    return context;
};
