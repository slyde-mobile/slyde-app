import { List, ListItem, Paper } from '@mui/material';
import { IUser } from '../providers/User';
import { ApolloError } from '@apollo/client';
import { SelectUserEvent } from '../pages/Send';
import SearchBySNSListItem from './SearchBySNSListItem';

function SearchBySNSList({
    users,
    listRef,
    searchTerm,
    error,
    handleSelectUser,
}: {
    users: IUser[] | null;
    listRef: React.RefObject<HTMLUListElement>;
    searchTerm: string;
    error: ApolloError | undefined;
    handleSelectUser: (user: SelectUserEvent) => void;
}) {
    const handleListItemClick = (user: IUser | null) => {
        if (user == null) {
            handleSelectUser({
                user: null,
                event: 'select-current-search',
                sns: searchTerm,
            });
            return;
        }
        handleSelectUser({
            user: user,
            event: 'select-user',
            sns: user.sns ? user.sns : '',
        });
    };

    return (
        <Paper
            sx={{
                maxHeight: 400,
                overflow: 'auto',
                backgroundColor: 'background.default',
            }}
        >
            <List ref={listRef}>
                {searchTerm && searchTerm.length > 1 && (
                    <SearchBySNSListItem
                        onClick={handleListItemClick}
                        key="current-search"
                        primaryText={`@${searchTerm}`}
                        secondaryText="&nbsp;"
                        user={null}
                    />
                )}
                {error ? (
                    <ListItem>Error: {error.message}</ListItem>
                ) : users ? (
                    users.map((user: IUser) => (
                        <SearchBySNSListItem
                            onClick={handleListItemClick}
                            key={user.account}
                            primaryText={'@' + user.sns}
                            secondaryText={user.name || 'No name available'}
                            user={user}
                        />
                    ))
                ) : (
                    <></>
                )}
            </List>
        </Paper>
    );
}

export default SearchBySNSList;
