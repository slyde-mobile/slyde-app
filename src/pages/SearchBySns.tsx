import { InputAdornment, TextField, Typography } from '@mui/material';
import { gql, useLazyQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { IUser } from '../providers/User';
import { useEffect, useRef, useState } from 'react';
import { SelectUserEvent } from './Send';
import SearchBySNSList from '../components/SearchBySNSList';

type SearchBySNSResponse = {
    searchBySns: IUser[];
};

const SEARCH_BY_SNS = gql`
    query SearchBySns($sns: String!) {
        searchBySns(sns: $sns) {
            account
            sns
            verifierId
            verifier
            name
        }
    }
`;

const containerVariants = {
    hidden: {
        y: '100vh', // Start above the screen
    },
    visible: {
        y: 0, // End at the natural position
        transition: {
            duration: 0.2, // Define how long the animation should take
            ease: 'linear', // Define the type of easing. Here it is linear.
        },
    },
    exit: {
        y: '100vh', // Exit off the bottom of the screen
        transition: {
            duration: 0.3, // Define how long the animation should take
            ease: 'linear', // Define the type of easing. Here it is linear.
        },
    },
};

function SearchBySNS({
    onSelect: handleSelectUser,
    value: value,
}: {
    onSelect: (user: SelectUserEvent) => void;
    value: string;
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [executeSearch, { data, error }] =
        useLazyQuery<SearchBySNSResponse>(SEARCH_BY_SNS);
    const listRef = useRef<HTMLUListElement>(null);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value.length > 2) {
            executeSearch({ variables: { sns: value } });
        }
    };

    const onBlur = () => {
        // Delay the blur event to check if the user is interacting with the list
        setTimeout(() => {
            if (
                !listRef.current ||
                !listRef.current.contains(document.activeElement)
            ) {
                handleSelectUser({
                    user: null,
                    event: 'blur',
                    sns: searchTerm,
                });
            }
        }, 0);
    };

    useEffect(() => {
        if (value !== '') {
            setSearchTerm(value);
            if (value.length > 2) {
                executeSearch({ variables: { sns: value } });
            }
        }
    }, []);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
                position: 'fixed', // Fix position to the bottom of the screen
                top: 0,
                left: 0,
                bottom: 0,
                backgroundColor: '#0e1848', // Dark blue background
                right: 0, // Stretch across the full width of the screen
                zIndex: 100, // Make sure it's on top of other elements
                // Add additional styling as needed
            }}
        >
            <div style={{ marginTop: '28px' }}>
                <div style={{ padding: '20px' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Send to"
                        color="secondary"
                        inputProps={{ style: { color: 'white' } }}
                        contentEditable={false}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onBlur={onBlur}
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Typography
                                        variant="h6"
                                        color="textSecondary"
                                    >
                                        &nbsp;
                                    </Typography>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Typography
                                        variant="h6"
                                        color="textSecondary"
                                    >
                                        .
                                        {import.meta.env.VITE_SNS_PARENT_DOMAIN}
                                    </Typography>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <SearchBySNSList
                        users={data ? data.searchBySns : null}
                        listRef={listRef}
                        searchTerm={searchTerm}
                        error={error}
                        handleSelectUser={handleSelectUser}
                    />
                </div>
            </div>
        </motion.div>
    );
}

export default SearchBySNS;
