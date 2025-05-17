import React, { useContext, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios';
import { AppContent } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  axios.defaults.withCredentials = true
  const { backendUrl } = useContext(AppContent);
  const [email, setEmail] = useState("")
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

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


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await axios.post(`${backendUrl}/api/auth/send-password-reset-otp`, {
        email: email
      }, {
        withCredentials: true
      });
      const { data: responseData } = response
      if (responseData.success) {
        toast.success(responseData.message)
        navigate("/forgot-password", { state: { email: email } })
      } else {
        toast.error(responseData.message)
      }

    } catch (error) {
      console.error("Error in reset password:", error);
      toast.error("Error in reset password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img src={assets.logo}
        onClick={() => navigate("/")}
        className=" absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        alt="" />

      <form onSubmit={handleSubmit} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter your registered email</p>

        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.mail_icon} alt="mail icon" className='w-4 h-4' />
          <input type="email" placeholder='Email id' className='bg-transparent outline-none text-white'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className='w-full py-1 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white text-lg rounded'>{
          loading ? "loading.." : "Send OTP"
        }</button>

      </form>

    </div>
  )
}

export default ResetPassword