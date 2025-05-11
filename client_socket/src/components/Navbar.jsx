import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContent } from '../contexts/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
    const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContent);
    console.log(userData)

    const navigate = useNavigate();

    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true

            const response = await axios.post(`${backendUrl}/api/auth/send-verify-otp`);
            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                navigate("/verify-email")
            } else {
                toast.error(responseData.message)
            }
        } catch (error) {
            console.error("Error sending verification OTP:", error);
            toast.error("Error sending verification OTP")
        }
    }

    const handleLogout = async () => {
        try {
            console.log("Comming to logout")
            const response = await axios.post(`${backendUrl}/api/auth/logout`, {
                withCredentials: true
            });
            const { data: responseData } = response
            console.log("response from logout", responseData);
            if (responseData.success) {
                toast.success(responseData.message, {
                    autoClose: 1500
                })
                setUserData(false)
                setIsLoggedIn(false)
                navigate("/")
            } else {
                console.log("Logout failed")
            }
        } catch (error) {
            toast.error("Logout failed", {
                autoClose: 1500
            })
            console.error("Logout error:", error);
        }
    }

    return (
        <div className="w-full flex items-center justify-between p-4 sm:p-6 sm:px-24 absolute top-0">
            <img src={assets.logo} alt=""
                className='w-28 sm:w-32'
            />

            {userData ? (
                <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
                    {userData.data.name[0].toUpperCase()}
                    <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
                        <ul className="list-none m-0 p-2 bg-gray-100 text-sm shadow-md min-w-[150px]">
                            {
                                !userData.data.isAccountVerified && (
                                    <li onClick={sendVerificationOtp} className="py-2 px-4 hover:bg-gray-200 cursor-pointer whitespace-nowrap font-medium">
                                        Verify Email
                                    </li>
                                )
                            }

                            <li onClick={handleLogout} className="py-2 px-4 hover:bg-gray-200 cursor-pointer whitespace-nowrap font-medium">
                                Logout
                            </li>
                        </ul>
                    </div>

                </div>
            ) : (
                <Link to={"/login"}
                    className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 hover:bg-blue-50 hover:text-gray-800 transition-all'
                >Login <img src={assets.arrow_icon} alt="" /></Link>
            )}


        </div>
    )
}

export default Navbar