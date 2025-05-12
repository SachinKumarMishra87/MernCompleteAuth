import { createContext, useEffect, useState } from "react";
import axios from "axios"
export const AppContent = createContext()
import { toast } from "react-toastify"
export const AppContextPrpvider = (props) => {

    axios.defaults.withCredentials = true

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false)

    const getAuthState = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/is-auth`,{
                withCredentials: true
            });
            if (data.success) {
                setIsLoggedIn(true);
                getUserData()
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    useEffect(() => {
        getAuthState()
    }, [])

    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-user-details`, {
                withCredentials: true
            });
            data.success ? setUserData(data) : toast.error(data.message)
            console.log("data from appconet", data)
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("error",error)
        }
    }

    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData, getUserData

    }

    return (
        <AppContent.Provider value={value}>
            {
                props.children
            }
        </AppContent.Provider>
    )
}