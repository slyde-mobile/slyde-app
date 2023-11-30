import { Box, Typography } from '@mui/material';
import { useGlobalState } from '../providers/GlobalStateProvider';
import ProfileAvatarAndAccount from '../components/ProfileAvatarAndAccount';
import { gql, useLazyQuery } from '@apollo/client';
import { User } from '../providers/User';
import { useEffect, useState } from 'react';
import TransactionHistory from '../components/TransactionHistory';

interface GetUserResponse {
    user: User;
}

const GET_USER = gql`
    query GetUser($account: String!) {
        user(account: $account) {
            account
            sns
            verifier
            verifierId
            emailAddress
            name
        }
    }
`;

function UserProfile() {
    const { userProfileAccount } = useGlobalState().state;
    const [user, setUser] = useState<User | null>(null);
    const [getUser, { loading, error, data }] = useLazyQuery<
        GetUserResponse,
        any
    >(GET_USER);

    console.log('userProfileAccount', userProfileAccount);
    useEffect(() => {
        if (userProfileAccount) {
            getUser({
                variables: { account: userProfileAccount },
                fetchPolicy: 'cache-first',
            });
        }
        const initializeUser = async () => {
            if (!data || !hasUserChanged(data.user, user)) return;
            const newUser = new User(
                data.user.sns,
                data.user.emailAddress,
                data.user.account,
                data.user.verifier,
                data.user.verifierId,
                data.user.name,
                new Date(),
            );
            await newUser.populateSNSAccount();
            setUser(newUser);
        };
        initializeUser();
    }, [data]);

    const hasUserChanged = (newUser: User, currentUser: User | null) => {
        if (!currentUser) return true;
        return newUser.account !== currentUser.account;
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    if (!data) return <p>...</p>;

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{ marginTop: 10, width: 1 }}
            >
                <ProfileAvatarAndAccount user={user} />
                <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
                    {user?.name}
                </Typography>
                <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
                    {user?.emailAddress}
                </Typography>
            </Box>
            <TransactionHistory account={user?.account} />
        </>
    );
}

export default UserProfile;
