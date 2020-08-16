import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

//Scroll Top on Page Change
const ScrollTop: React.FC = () => {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    return null;
};

export default ScrollTop;
