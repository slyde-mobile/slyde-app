import { Avatar, Typography } from '@mui/material';
import RocketIcon from '@mui/icons-material/Rocket';
import { User } from '../providers/User';

const ProfileAvatarAndAccount = ({ user }: { user: User | null }) => {
    return (
        <>
            <Avatar
                sx={{
                    width: 100,
                    height: 100,
                    padding: 2,
                    color: 'secondary.main',
                    backgroundColor: 'primary.light',
                }}
                alt="Profile Picture"
            >
                <RocketIcon sx={{ width: 100, height: 100 }} />
            </Avatar>
            <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
                @{user?.snsAccount?.snsName}
            </Typography>
        </>
    );
};

export default ProfileAvatarAndAccount;
