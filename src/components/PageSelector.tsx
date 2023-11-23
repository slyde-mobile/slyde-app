import AddFunds from '../pages/AddFunds';
import ProfilePage from '../pages/Profile';
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
            case 'profile':
                return <ProfilePage />;
            default:
                return <Dashboard />;
        }
    }
    return <ChooseUsername />;
};

export default PageSelector;
