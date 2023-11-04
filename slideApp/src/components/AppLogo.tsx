import React from 'react';

function AppLogo(props: { style?: React.CSSProperties }) {
    return (
        <img
            src="/slyde-logo.png"
            style={{ width: '200px', height: '223px', ...props.style }}
            alt="Slyde Logo"
        />
    );
}

export default AppLogo;
