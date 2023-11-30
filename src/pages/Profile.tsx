import { useState } from 'react';
import { Box } from '@mui/material';
import { gql, useMutation } from '@apollo/client';
import { useGlobalState } from '../providers/GlobalStateProvider';
import ProfileAvatarAndAccount from '../components/ProfileAvatarAndAccount';
import EditableProfileTextField from '../components/EditableProfileTextField';

// Define your mutation here
const UPDATE_USER_MUTATION = gql`
    mutation UpdateUser($username: String!, $name: String, $email: String) {
        updateUser(id: $id, username: $username, name: $name, email: $email) {
            username
            name
            email
        }
    }
`;

function ProfilePage() {
    const { user } = useGlobalState().state;
    const [updateUser] = useMutation(UPDATE_USER_MUTATION);

    const [values, _] = useState<{ [key: string]: string }>({
        name: user?.name || '',
        email: user?.emailAddress || '',
    });

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ marginTop: 10, width: 1 }}
        >
            <ProfileAvatarAndAccount user={user} />

            {Object.keys(values).map((key) => (
                <EditableProfileTextField
                    key={key}
                    name={key}
                    initialValue={values[key]}
                    onSaveChange={(value: string) => {
                        updateUser({
                            variables: { username: user?.sns, [key]: value },
                        });
                    }}
                />
            ))}
        </Box>
    );
}

export default ProfilePage;
