import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Page } from './PageSelector';
import { backPages } from './AppTopBar';

function AppTopBarIcon(props: { currentPage: Page }) {
    if (backPages.includes(props.currentPage)) {
        return <ArrowBackIcon />;
    }
    return <></>;
}
export default AppTopBarIcon;
