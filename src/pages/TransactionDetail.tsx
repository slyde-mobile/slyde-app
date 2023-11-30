import { formatAccount, formatDate } from '../util/util';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { ActionTypes, useGlobalState } from '../providers/GlobalStateProvider';
import { Page } from '../components/PageSelector';

const TransactionDetail = () => {
    const { state, dispatch } = useGlobalState();
    const { transactionDetail } = state;
    if (!transactionDetail) {
        return <></>;
    }

    const loadProfilePage = (account: string) => {
        dispatch({
            type: ActionTypes.SetCurrentPage,
            payload: { page: Page.UserProfile, object: account },
        });
    };

    const theme = useTheme();
    // const isReceived =
    //     transactionDetail.instructions[0].direction === 'received';

    return (
        <Paper
            elevation={1}
            sx={{
                padding: 2,
                marginTop: 10,
                marginLeft: 2,
                marginRight: 2,
                marginBotton: 2,
                backgroundColor: 'primary.main',
            }}
        >
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography variant="h6" color="secondary">
                    <span
                        style={{
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            loadProfilePage(
                                transactionDetail.rollup.fromAccount,
                            );
                        }}
                    >
                        @
                        {formatAccount(
                            transactionDetail.rollup.fromSns.split('.')[0],
                        )}
                    </span>{' '}
                    <span style={{ color: theme.palette.text.primary }}>
                        paid
                    </span>{' '}
                    <span
                        style={{
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            loadProfilePage(transactionDetail.rollup.toAccount);
                        }}
                    >
                        @
                        {formatAccount(
                            transactionDetail.rollup.toSns.split('.')[0],
                        )}
                    </span>{' '}
                    <span style={{ color: theme.palette.text.primary }}>
                        ${transactionDetail.instructions[0].uiAmountString}
                    </span>{' '}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {formatDate(new Date(transactionDetail.createdAt))}
                </Typography>
            </Box>
            <Box
                marginTop={2}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography variant="h2">
                    {transactionDetail.memo || 'No message'}
                </Typography>
            </Box>
        </Paper>
    );
};

export default TransactionDetail;
