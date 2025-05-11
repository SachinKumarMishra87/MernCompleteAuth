import React, { useContext, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios';
import { AppContent } from '../contexts/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmailVerify = () => {
  axios.defaults.withCredentials = true
  const { userData, isLoggedIn, backendUrl, getUserData, setUserData, setIsLoggedIn } = useContext(AppContent);

  const navigate = useNavigate()
  const inputRef = useRef([]);

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
    const pastedData = e.clipboardData.getData('text/plain')
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
      const otp = inputRef.current.map(input => input.value).join("");

      const response = await axios.post(`${backendUrl}/api/auth/verify-acconut`, {
        otp: otp
      }, {
        withCredentials: true
      });
      const { data: responseData } = response
      if (responseData.success) {
        toast.success(responseData.message)
        getUserData();
        navigate("/")
      } else {
        toast.error(responseData.message)
      }
    } catch (error) {
      console.error("Error in email verification:", error);
      toast.error("Error in email verification")
    }
  }

  useEffect(() => {
    if (isLoggedIn && userData && userData.data.isAccountVerified) {
      navigate("/")
    }
  }, [isLoggedIn, userData])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img src={assets.logo}
        onClick={() => navigate("/")}
        className=" absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        alt="" />

      <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter your 6 digit code sent to your email id.</p>

        <div className="flex justify-between mb-8 " onPaste={handlePaste}>
          {
            Array(6).fill(0).map((_, index) => (
              <input type="text" key={index} maxLength={1} className='w-10 h-10 text-white text-lg rounded outline-none text-center bg-[#333A5C]' ref={e => inputRef.current[index] = e} onInput={(e) => handleInput(e, index)} required />
            ))
          }
        </div>

        <button className='w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white text-lg rounded-full'>Verify Email</button>
      </form>
    </div>
  )
}

export default EmailVerify