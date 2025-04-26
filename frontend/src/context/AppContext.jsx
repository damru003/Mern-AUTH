import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');

            if (data.success) {
                setuserData(data.userData);
            } else {
                toast.error(data.message || 'Failed to load user data');
            }
        }
        catch (error) {
            console.error('User data fetch error:', error);
            toast.error(error.response?.data?.message || 'Something went wrong while fetching user data');
        }
    }

    const getAuthState = async() => {

        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth')

            if (data.success) {
                setisLoggedin(true)
                getUserData()
            }
        }
        catch(error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getAuthState()
    }, [])

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isloggedin, setisLoggedin] = useState(false);
    const [userData, setuserData] = useState(false);

    const value = {
        backendUrl,
        isloggedin, setisLoggedin,
        userData, setuserData,
        getUserData,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}