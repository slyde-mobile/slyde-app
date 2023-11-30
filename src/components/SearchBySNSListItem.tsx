import { ListItemButton, ListItemText } from '@mui/material';
import { IUser } from '../providers/User';

function SearchBySNSListItem({
    onClick,
    primaryText,
    secondaryText,
    user,
}: {
    onClick: (user: IUser | null) => void;
    primaryText: string;
    secondaryText: string;
    user: IUser | null;
}) {
    return (
        <ListItemButton
            sx={{
                border: '1px solid',
                borderColor: 'primary.main',
                marginBottom: 1,
            }}
            onClick={() => onClick(user)}
        >
            <ListItemText primary={primaryText} secondary={secondaryText} />
        </ListItemButton>
    );
}

export default SearchBySNSListItem;
