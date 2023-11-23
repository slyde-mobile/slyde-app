import { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  TextField,
  Typography,
  IconButton,
  Box,
  InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { gql, useMutation } from '@apollo/client';
import { useUser } from '../providers/UserProvider';

// Define your mutation here
const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $username: String, $name: String, $email: String) {
    updateUser(id: $id, username: $username, name: $name, email: $email) {
      id
      username
      name
      email
    }
  }
`;

function ProfilePage() {
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({
    name: false,
    email: false,
  });
  const [values, setValues] = useState<{ [key: string]: string }>({
    name: 'John Doe',
    email: 'john@example.com',
  });

  const { user, web3User } = useUser();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [updateUser] = useMutation(UPDATE_USER_MUTATION);

const fieldRefs: { [key: string]: React.RefObject<HTMLInputElement> } = {
    name: nameRef,
    email: emailRef,
};

const handleEditClick = (field: string) => {
    setEditing({ ...editing, [field]: true });
};

const handleCheckClick = (field: string) => {
    setEditing({ ...editing, [field]: false });
    // Call the mutation
    updateUser({ variables: { ...values } });
};

const handleChange = (field: string, value: string) => {
    setValues({ ...values, [field]: value });
  };

useEffect(() => {
    Object.keys(editing).forEach((key) => {
        if (editing[key] && fieldRefs[key].current) {
            fieldRefs[key]?.current?.focus();
        }
    });
}, [editing]);

useEffect(() => {
    if (user) {
        console.log(user, web3User);
        setValues({
            name: user?.name || '',
            email: user?.emailAddress || '',
          });
    }
}, [user]);

return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{marginTop:10, width: 1}}>
      <Avatar
        src="/profile.jpg"
        sx={{ width: 100, height: 100 }}
        alt="Profile Picture"
      />
      <Typography variant="h6" sx={{marginTop:2, marginBottom: 2}}>@{user?.snsAccount?.snsName}</Typography>

      {Object.keys(values).map((key) => (
        <Box key={key} sx={{
            display: 'flex',
            alignItems: 'center',
            width: '96%', // Full width
            marginY: 0,
            padding: 2,
            marginLeft: 4,
            marginRight: 4,
          }}>
            {editing[key] ? (
            <TextField
                fullWidth
                variant="outlined"
                color="secondary"
                value={values[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                inputRef={fieldRefs[key]}
                inputProps={{ style: { color: 'white' } }}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <Typography variant="h6" color="textSecondary">&nbsp;</Typography>
                    </InputAdornment>
                    ),
                    style: { color: 'white' }, // You can move this to a global class or sx prop
                }}
                sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      paddingRight: '40px', // make room for the icon button
                    },
                  }}
            />
            ) : (
            <TextField
                fullWidth
                variant="outlined"
                color="secondary"
                value={values[key]}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                InputProps={{
                readOnly: true,
                startAdornment: (
                    <InputAdornment position="start">
                    <Typography variant="h6" color="textSecondary">&nbsp;</Typography>
                    </InputAdornment>
                ),
                style: { color: 'white' }, // You can move this to a global class or sx prop
                }}
                sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      paddingRight: '40px', // make room for the icon button
                    },
                  }}                
            />
            )}
            <IconButton
            onClick={() => {
                editing[key] ? handleCheckClick(key) : handleEditClick(key);
            }}
            size="small"
            sx={{
                position: 'absolute', // Position the button absolutely to the right of the TextField
                right: '18px', // Adjust right position to match your design needs
                backgroundColor: '#f2b842', // Yellow background
                borderRadius: '4px', // Rounded border
                '&:hover': {
                  backgroundColor: '#cca42b', // A darker yellow for hover state
                },
                '& .MuiSvgIcon-root': {
                  color: 'white', // White icon
                },
                padding: '10px',
              }}
            >
            {editing[key] ? <CheckIcon /> : <EditIcon />}
            </IconButton>
        </Box>
    ))}
    </Box>
  );
}

export default ProfilePage;