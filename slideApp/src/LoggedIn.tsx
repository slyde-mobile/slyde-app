import ChooseUsername from './ChooseUsername';
import Dashboard from './Dashboard';
import { useUser } from './providers/UserProvider';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function LoggedIn() {
    const { user, currentPage } = useUser();    

    const PageSwitcher = () => {
        if (user != null && user.sns != null) {
            switch (currentPage) {
                case 'send':
                    return <></>;
                default:
                    return <Dashboard />;
            }
        }
        return <ChooseUsername />;
    };

    return (
        <Container
            style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        color="secondary"
                        sx={{ flexGrow: 1 }}
                    >
                        Slyde
                    </Typography>
                    <Button color="inherit">Logout</Button>
                </Toolbar>
            </AppBar>

            <PageSwitcher />
        </Container>
    );
}

export default LoggedIn;
