import React, { useEffect } from "react";
//import { useLocation } from "react-router-dom";

const ScrollTop: React.FC = () => {
    //const location = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0);
    })
    return null;
}

export default ScrollTop