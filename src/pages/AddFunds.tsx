import React from 'react';
import { TextField, Typography, Box, Container, Tooltip, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSnackbar } from 'notistack';
import { useUser } from '../providers/UserProvider';

interface CopySectionProps {
  label: string;
  value: string;
}

const CopySection: React.FC<CopySectionProps> = ({ label, value }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      enqueueSnackbar('Copied to clipboard', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Failed to copy', { variant: 'error' });
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" bgcolor="background.main" p={2} mb={2}>
      <Box display="flex" alignItems="center" flexGrow={1} ml={2}>
        <TextField fullWidth value={value} InputProps={{ readOnly: true }}  variant="outlined" label={label} />
        <Tooltip title="Copy">
          <IconButton onClick={handleCopy} sx={{ ml: 1, padding: 1.85, color: 'text.primary', bgcolor: 'secondary.main', borderRadius: 1 }}>
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

const AddFunds: React.FC = () => {
    const {
        user
    } = useUser();
    const snsName = user?.snsAccount ? user?.snsAccount?.snsName : ""; // Replace with actual SNS name
    const fullAddress = user?.snsAccount ? user?.snsAccount?.account.toBase58() : ""; // Replace with actual full address

    return (
        <Container maxWidth="md" sx={{ height: '100vh', marginTop: 12, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <Typography variant="h5" mb={4}>
                Use either address below to fund your slyde account with USDC. <br />
                Please send <strong>only</strong> native USDC on Solana to this account.
            </Typography>
            <CopySection label="Slyde Name" value={snsName} />
            <CopySection label="Full Address" value={fullAddress} />
        </Container>
    );
};

export default AddFunds;
