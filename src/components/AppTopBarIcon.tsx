import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function AppTopBarIcon(props: { currentPage: string }) {
    switch (props.currentPage) {
        case 'send':
        case 'receive':
        case 'profile':
            return <ArrowBackIcon />;
        default:
            return <></>;
    }
}
export default AppTopBarIcon;
