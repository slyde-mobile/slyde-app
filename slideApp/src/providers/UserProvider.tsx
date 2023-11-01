import React, { createContext } from 'react';
import { OpenloginUserInfo } from '@web3auth/openlogin-adapter';

export interface User {
    account: string;
    sns: string | null;
    email_address: string | null;
    last_login: Date;
}

interface UserContextProps {
    web3User: Partial<OpenloginUserInfo> | null;
    setWeb3User: React.Dispatch<
        React.SetStateAction<Partial<OpenloginUserInfo> | null>
    >;

    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;

    loggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;

    account: string;
    setAccount: React.Dispatch<React.SetStateAction<string>>;

    web3AuthKey: string;
    setWeb3AuthKey: React.Dispatch<React.SetStateAction<string>>;

    currentPage: string;
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children,
}) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [web3User, setWeb3User] =
        React.useState<Partial<OpenloginUserInfo> | null>(null);
    const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
    const [account, setAccount] = React.useState<string>('');
    const [web3AuthKey, setWeb3AuthKey] = React.useState<string>('');
    const [currentPage, setCurrentPage] = React.useState<string>('dashboard');
    return (
        <UserContext.Provider
            value={{
                user,
                web3User,
                loggedIn,
                account,
                web3AuthKey,
                currentPage,
                setUser,
                setWeb3User,
                setLoggedIn,
                setAccount,
                setWeb3AuthKey,
                setCurrentPage,
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
