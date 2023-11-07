import AppLoadingImage from '../components/AppLogoLoading';
import { keyframes, styled } from '@mui/system';

// Define the keyframes
const rotateBorder = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
`;

// Create a styled div with the animation
const AnimatedBorderDiv = styled('div')(({ theme }) => ({
    width: '100%',
    height: '100vh',
    borderStyle: 'solid',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    margin: '0px', // Set margin here
    borderWidth: theme.spacing(0.25),
    boxSizing: 'border-box',
    borderImageSlice: 1,
    animation: `${rotateBorder} 1s linear infinite`,
    borderImageSource:
        'linear-gradient(270deg, #ffcc33, #9933ff, #ffcc33, #9933ff)',
}));

function AppLoading() {
    return (
        <AnimatedBorderDiv>
            <AppLoadingImage />
        </AnimatedBorderDiv>
    );
}

export default AppLoading;
