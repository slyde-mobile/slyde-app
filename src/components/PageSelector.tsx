import AddFunds from '../pages/AddFunds';
import ProfilePage from '../pages/Profile';
import TransactionDetail from '../pages/TransactionDetail';
import UserProfile from '../pages/UserProfile';
import { useGlobalState } from '../providers/GlobalStateProvider';
import ChooseUsername from './../pages/ChooseUsername';
import Dashboard from './../pages/Dashboard';
import SendPrompt from './../pages/Send';

export enum Page {
    Send = 'send',
    Receive = 'receive',
    Profile = 'profile',
    UserProfile = 'user_profile',
    Dashboard = 'dashboard',
    TransactionDetail = 'transaction_detail',
}

const PageSelector = () => {
    const { user, currentPage } = useGlobalState().state;

    if (user != null && user.snsAccount != null) {
        switch (currentPage) {
            case Page.Send:
                return <SendPrompt />;
            case Page.Receive:
                return <AddFunds />;
            case Page.Profile:
                return <ProfilePage />;
            case Page.TransactionDetail:
                return <TransactionDetail />;
            case Page.UserProfile:
                return <UserProfile />;
            default:
                return <Dashboard />;
        }
    }
    return <ChooseUsername />;
};

export default PageSelector;
