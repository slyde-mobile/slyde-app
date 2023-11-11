import { motion, useAnimation, useCycle } from 'framer-motion';
import { useEffect } from 'react';

const loadingVariants = {
    scaledUp: {
        scale: 1.02,
    },
    scaledDown: {
        scale: 1,
    },
};

const AppLoadingImage = () => {
    const controls = useAnimation();
    const [animate, cycle] = useCycle('scaledUp', 'scaledDown');

    useEffect(() => {
        controls.start(animate).then(() => {
            cycle();
        });
    }, [animate, controls, cycle]);

    return (
        <motion.img
            src="/slyde-logo.png"
            style={{ width: '200px', height: '223px' }}
            alt="Loading..."
            animate={controls}
            variants={loadingVariants}
            transition={{
                duration: 0.8,
                ease: 'easeInOut',
            }}
        />
    );
};

export default AppLoadingImage;
