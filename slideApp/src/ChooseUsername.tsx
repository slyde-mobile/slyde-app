import React, { useEffect, useState } from 'react';
import RPC from "./solanaRPC"

import { Button, InputAdornment, TextField, Typography } from '@mui/material';


function ChooseUsername(props: any) {
    const provider = props.provider;
    const [address, setAddress] = useState('');

    useEffect(() => {
        const getAddress = async () =>{
            if (!provider) {
                return;
              }
              const rpc = new RPC(provider);
              const address = await rpc.getAccounts();
          setAddress(address[0]);
        };
        getAddress();
      }, []);

    return (    
        <>
            <h3>logo</h3>
            <h1>Slyde</h1>
            <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <TextField
                    fullWidth                    
                    variant="outlined"
                    placeholder="Enter your username"
                    color="secondary"
                    inputProps={{ style: { color: 'white' } }}
                    InputProps={{
                        endAdornment: (
                        <InputAdornment position="end">
                            <Typography variant="h6" color="textSecondary">
                            .slyde
                            </Typography>
                        </InputAdornment>
                        ),
                    }}
                    />                    
                </div>
                
                <Button variant="contained" color="secondary" fullWidth style={{ marginBottom: '10px' }}>
                    Choose Username
                </Button>
                {address && <div><Typography variant="caption" color="textSecondary">{address}</Typography></div>}
            </div>
        </>
    )
}

export default ChooseUsername;