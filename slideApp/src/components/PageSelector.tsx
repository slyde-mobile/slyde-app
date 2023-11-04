import { useUser } from '../providers/UserProvider';
import ChooseUsername from './../pages/ChooseUsername';
import Dashboard from './../pages/Dashboard';
import SendPrompt from './../pages/Send';

const PageSelector = () => {
    const { user, currentPage } = useUser();

    if (user != null && user.sns != null) {
        switch (currentPage) {
            case 'send':
                return <SendPrompt />;
            default:
                return <Dashboard />;
        }
    }
    return <ChooseUsername />;
};

export default PageSelector;
