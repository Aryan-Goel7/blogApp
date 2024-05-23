import React from 'react'
import { useDispatch } from "react-redux";

import { logout } from "../../store/authSlice";
import authService from '../../appwrite/auth';


function LogOutBtn() {
    const dispatch = useDispatch();
    const logOutHandler = () => {
        authService.logOut().then(() => {
            dispatch(logout());
        }).catch(() => {
            console.log("An Error Occured in LogOut Button");
        });

    }
    return (
        <button className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full' onClick={logOutHandler}>Log Out</button>
    )
}

export default LogOutBtn