import React, { useContext, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios';
import { AppContent } from '../contexts/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    axios.defaults.withCredentials = true
    const { backendUrl } = useContext(AppContent);
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const inputRef = useRef([]);

    const location = useLocation();
    const email = location.state?.email;


    const handleInput = (e, index) => {
        const value = e.target.value;
        if (value.length > 1) {
            e.target.value = value.slice(0, 1);
        }
        if (index < 5 && value) {
            inputRef.current[index + 1].focus();
        } else if (index === 5 && value) {
            inputRef.current[index].blur();
        }
        if (value === "") {
            if (index > 0) {
                inputRef.current[index - 1].focus();
            }
        }
    }

    const handlePaste = (e) => {
        const pastedData = e.clipboardData.getData('text')
        const pasteArray = pastedData.split("")
        pasteArray.forEach((char, index) => {
            if (inputRef.current[index]) {
                inputRef.current[index].value = char
            }
        })
    }

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            const otp = inputRef.current.map(input => input.value).join("");
            const response = await axios.post(`${backendUrl}/api/auth/verify-password-reset-otp`, {
                otp: otp,
                email: email,
                newPassword: newPassword
            }, {
                withCredentials: true
            });
            const { data: responseData } = response
            console.log(responseData)
            if (responseData.success) {
                toast.success(responseData.message)
                navigate("/login")
            } else {
                toast.error(responseData.message)
            }
        } catch (error) {
            console.error("Error in email verification:", error);
            toast.error("Error in email verification")
        } finally {
            setLoading(false)
        }
    }

    console.log("email : ", email)
    console.log("newPassword : ", newPassword)
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
            <img src={assets.logo}
                onClick={() => navigate("/")}
                className=" absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
                alt="" />

            <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                <h1 className='text-white text-2xl font-semibold text-center mb-4'>Verify OTP & Reset Password</h1>
                <p className='text-center mb-6 text-indigo-300'>Enter your new password & OTP</p>

                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                    <img src={assets.mail_icon} alt="mail icon" className='w-4 h-4' />
                    <input type="email" placeholder='Email id' className='bg-transparent outline-none text-white'
                        value={email}
                        readOnly
                        required
                    />
                </div>



                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                    <img src={assets.lock_icon} alt="mail icon" className='w-4 h-4' />
                    <input type="text" placeholder='new password' className='bg-transparent outline-none text-white'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="flex justify-around mb-4" onPaste={handlePaste}>
                    {
                        Array(6).fill(0).map((_, index) => (
                            <input type="text" key={index} maxLength={1} className='w-10 h-10 text-white text-lg rounded outline-none text-center bg-[#333A5C]' ref={e => inputRef.current[index] = e} onInput={(e) => handleInput(e, index)} required />
                        ))
                    }
                </div>

                <button className='w-full py-1 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white text-lg rounded'>{
                    loading ? "loading.." : "Submit"
                }</button>
            </form>
        </div>
    )
}

export default ForgotPassword