import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component to disable automatic scroll restoration on route changes
 * This prevents the page from scrolling to top when navigating between routes
 */
const DisableScrollRestoration = () => {
    const location = useLocation();

    useEffect(() => {
        // Prevent scroll restoration by keeping the current scroll position
        // This is intentionally empty - we don't want to scroll anywhere
    }, [location.pathname]);

    return null;
};

export default DisableScrollRestoration;
