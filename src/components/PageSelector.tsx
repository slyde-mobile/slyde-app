import AddFunds from '../pages/AddFunds';
import { useUser } from '../providers/UserProvider';
import ChooseUsername from './../pages/ChooseUsername';
import Dashboard from './../pages/Dashboard';
import SendPrompt from './../pages/Send';

const PageSelector = () => {
    const { user, currentPage } = useUser();

    if (user != null && user.snsAccount != null) {
        switch (currentPage) {
            case 'send':
                return <SendPrompt />;
            case 'receive':
                    return <AddFunds />;
            default:
                return <Dashboard />;
        }
    }
    return <ChooseUsername />;
};

export default PageSelector;
