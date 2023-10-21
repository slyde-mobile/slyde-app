import { useEffect, useState, useRef } from 'react';
import { Buffer } from "buffer/";
import RPC from "./solanaRPC"
import axios from 'axios';
import { getED25519Key } from "@toruslabs/openlogin-ed25519";
import { Button, InputAdornment, TextField, Typography } from '@mui/material';

function ChooseUsername(props: any) {
    const provider = props.provider;
    const web3auth = props.web3auth;
    const [address, setAddress] = useState('');
    const [userInfo, setUserInfo] = useState<any>({});
    const [pubKey, setPubKey] = useState('');

    const inputRef = useRef<HTMLInputElement>();

    useEffect(() => {
        const getAddress = async () =>{
            if (!provider) {
                console.log("provider not initialized yet");
                return;
            }
            if (!web3auth || !web3auth.connected) {
                console.log("web3auth not initialized yet");
                return;
            }
            const rpc = new RPC(provider);
            const userInfo = await web3auth.getUserInfo();              
            const accounts = await rpc.getAccounts();
            setAddress(accounts[0]);
            setUserInfo(userInfo);

            try { 
                const privateKey = await web3auth.provider.request({
                    method: "solanaPrivateKey"
                  });
                const hexPrivKey = Buffer.from(privateKey, "hex")
                setPubKey(getED25519Key(hexPrivKey).pk.toString('hex')); 
            } catch (error) {
                console.log(error);
            }
        };
        getAddress();
      }, [web3auth.connected]);

    async function claimSNSDomainRequest() {
        if (inputRef.current && inputRef.current !== null) {
            const inputValue = inputRef.current.value;
            try {
                const response = await axios.post('http://127.0.0.1:8080/v0/sns/claim', {
                    idToken: userInfo.idToken,
                    snsDomain: inputValue,
                    claimingAddress: address, 
                    publicKey: pubKey,
                });
                console.log(response.data);  // log the response to console
            } catch (error) {
                console.error(error);  // log any error to console
            }
        }
    }

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
                    inputRef={inputRef}
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
                
                <Button variant="contained" color="secondary" onClick={claimSNSDomainRequest} fullWidth style={{ marginBottom: '10px' }}>
                    Choose Username
                </Button>
                {address && <div><Typography variant="caption" color="textSecondary">{address}</Typography></div>}
            </div>
        </>
    )
}

export default ChooseUsername;