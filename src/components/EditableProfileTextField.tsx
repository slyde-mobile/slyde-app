import {
    TextField,
    Typography,
    IconButton,
    Box,
    InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { useEffect, useRef, useState } from 'react';

const EditableProfileTextField = ({
    name,
    initialValue,
    onSaveChange,
}: {
    name: string;
    initialValue: string;
    onSaveChange: (value: string) => void;
}) => {
    const ref = useRef<HTMLInputElement>(null);
    const [editing, setEditing] = useState<boolean>(false);
    const [value, setValue] = useState<string>(initialValue);
    const handleEditClick = () => {
        setEditing(true);
    };

    const handleCheckClick = () => {
        setEditing(false);
        onSaveChange(value);
    };

    const handleChange = (value: string) => {
        setValue(value);
    };

    useEffect(() => {
        if (editing && ref.current) {
            ref.current.focus();
        }
    }, [editing]);

    return (
        <Box
            key={name}
            sx={{
                display: 'flex',
                alignItems: 'center',
                width: '96%', // Full width
                marginY: 0,
                padding: 2,
                marginLeft: 4,
                marginRight: 4,
            }}
        >
            {editing ? (
                <TextField
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    inputRef={ref}
                    inputProps={{ style: { color: 'white' } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Typography variant="h6" color="textSecondary">
                                    &nbsp;
                                </Typography>
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
                    value={value}
                    placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
                    InputProps={{
                        readOnly: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Typography variant="h6" color="textSecondary">
                                    &nbsp;
                                </Typography>
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
                    editing ? handleCheckClick() : handleEditClick();
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
                {editing ? <CheckIcon /> : <EditIcon />}
            </IconButton>
        </Box>
    );
};

export default EditableProfileTextField;
