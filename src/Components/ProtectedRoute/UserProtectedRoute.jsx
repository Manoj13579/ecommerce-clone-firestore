import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { auth } from '../../Utilities/Configure.js';
import { onAuthStateChanged } from "firebase/auth";

const UserProtectedRoute = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authResolved, setAuthResolved] = useState(false);
    const userinfo = useSelector(state => state.userinfo);
    
    // Determine if any property is null
    const isAnyPropertyNull =
        userinfo.email === null ||
        userinfo.name === null ||
        userinfo.role === null ||
        userinfo.uid === null ||
        userinfo.registrationDate === null;

    // Effect to handle authentication state
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
            setAuthResolved(true); // Authentication state resolved
        });
        
    }, []);
/* to make toast not to rerender used useEffect. inside if (isAnyPropertyNull && !isLoggedIn) below causes rerender.
toast bhaviour is such(it displays for some time),it renders more tha once.
useEffect or hooks should be placed up and near another hook.
otherwise throws this error:
React Router caught the following error during render Error: Rendered more hooks than during the previous render. */
useEffect(() => {
    if (isAnyPropertyNull && !isLoggedIn) {
        toast.warn('You must login first');
    }
}, []);

    if (!authResolved) {
        return null; // Render nothing until authResolved is true
    }


    if (isAnyPropertyNull && !isLoggedIn) {
        return <Navigate to='/login' />;
    }

    return <Outlet />;
};

export default UserProtectedRoute;