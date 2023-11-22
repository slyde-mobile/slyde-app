import React, { createContext } from 'react';
import { OpenloginUserInfo } from '@web3auth/openlogin-adapter';
import { WalletBallance } from '../components/Balance';
import { User } from './User';

export interface UpdateAppReady {
    clientsInitialized: boolean;
    authTokensReady: boolean;
}

interface UserContextProps {
    web3User: Partial<OpenloginUserInfo> | null;
    setWeb3User: React.Dispatch<
        React.SetStateAction<Partial<OpenloginUserInfo> | null>
    >;

    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;

    userBalance: WalletBallance | null;
    setUserBalance: React.Dispatch<React.SetStateAction<WalletBallance | null>>;

    loggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;

    account: string;
    setAccount: React.Dispatch<React.SetStateAction<string>>;

    web3AuthKey: string;
    setWeb3AuthKey: React.Dispatch<React.SetStateAction<string>>;

    currentPage: string;
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;

    appReady: boolean;
    setAppReady: React.Dispatch<React.SetStateAction<boolean>>;

    processingTransactionState: string;
    setProcessingTransactionState: React.Dispatch<React.SetStateAction<string>>;

    updateAppReady: (update: UpdateAppReady) => void;

    appLoading: boolean;
    setAppLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children,
}) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [web3User, setWeb3User] =
        React.useState<Partial<OpenloginUserInfo> | null>(null);
    const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
    const [appReady, setAppReady] = React.useState<boolean>(false);
    const [processingTransactionState, setProcessingTransactionState] =
        React.useState<string>('not_started');
    const [account, setAccount] = React.useState<string>('');
    const [web3AuthKey, setWeb3AuthKey] = React.useState<string>('');
    const [currentPage, setCurrentPage] = React.useState<string>('dashboard');
    const [userBalance, setUserBalance] = React.useState<WalletBallance | null>(
        null,
    );
    const [appLoading, setAppLoading] = React.useState<boolean>(true);

    const updateAppReady = ({
        clientsInitialized,
        authTokensReady,
    }: UpdateAppReady) => {
        if (loggedIn && clientsInitialized && authTokensReady) {
            setTimeout(() => {
                setAppReady(true);
            }, 1000);
        }
    };
    return (
        <UserContext.Provider
            value={{
                user,
                web3User,
                loggedIn,
                account,
                web3AuthKey,
                currentPage,
                appReady,
                userBalance,
                processingTransactionState,
                appLoading,
                setAppLoading,
                updateAppReady,
                setUser,
                setWeb3User,
                setLoggedIn,
                setAccount,
                setWeb3AuthKey,
                setCurrentPage,
                setAppReady,
                setUserBalance,
                setProcessingTransactionState,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = React.useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
