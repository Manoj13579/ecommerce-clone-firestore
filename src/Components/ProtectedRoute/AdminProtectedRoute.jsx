import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const UserProtectedRoute = () => {
    const userinfo = useSelector(state => state.userinfo);
    const isAnyPropertyNull = 
    userinfo.email === null ||
    userinfo.name === null ||
    userinfo.role === null ||
    userinfo.uid === null  ||
    userinfo.registrationDate === null;


    // useEfect only used for displaying toast
    useEffect(() => {
        if (isAnyPropertyNull) {
            toast.warn('You must login first');
        }
    }, []);

    if (userinfo?.role === 'admin') {
        return <Outlet />;
    } else {
        return <Navigate to='/login' />;
    }
};

export default UserProtectedRoute;