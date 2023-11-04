import AppLoadingImage from '../components/AppLogoLoading';

function AppLoading() {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: '100vh', // vh stands for viewport height units
            }}
        >
            <AppLoadingImage />
        </div>
    );
}

export default AppLoading;
