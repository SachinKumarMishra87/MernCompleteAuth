import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContent } from "../contexts/AppContext";
import axios from "axios";
import { toast } from 'react-toastify';

const Login = () => {

  const [state, setState] = useState("Sign Up");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {

      if (state === "Sign Up") {
        const response = await axios.post(`${backendUrl}/api/auth/register`, data, {
          withCredentials: true
        });
        const { data: responseData } = response
        console.log("response", responseData);
        if (responseData.success) {
          setIsLoggedIn(true)
          getUserData();
          toast.success(responseData.message, {
            autoClose: 1500
          })
          navigate("/")
        } else {
          toast.error(responseData.message, {
            autoClose: 1500
          })
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/auth/login`, data, {
          withCredentials: true
        });
        const { data: responseData } = response
        console.log("response", responseData);
        if (responseData.success) {
          setIsLoggedIn(true)
          getUserData();
          toast.success(responseData.message, {
            autoClose: 1500
          })
          navigate("/")
        } else {
          toast.error(responseData.message, {
            autoClose: 1500
          })
        }

      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
    axios.defaults.withCredentials = true

  }


  console.log(data)
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img src={assets.logo}
        onClick={() => navigate("/")}
        className=" absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        alt="" />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">{state === "Sign Up" ? "Create Account" : "Login"}</h2>
        <p className="text-center text-sm mb-6">{state === "Sign Up" ? "Create your Account" : "Login to your account"}</p>

        <form onSubmit={submitHandler}>
          {
            state === "Sign Up" && (
              <div className="mb-4 flex items-center gap-3 w-full   px-5 py-2 rounded bg-[#333A5C]">
                <img src={assets.person_icon} alt="" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  className="outline-none border-none bg-transparent"
                />
              </div>
            )
          }

          <div className="mb-4 flex items-center gap-3 w-full   px-5 py-2 rounded bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              placeholder="Email id"
              required
              name="email"
              value={data.email}
              onChange={handleChange}
              className="outline-none border-none bg-transparent"
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full   px-5 py-2 rounded bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              value={data.password}
              onChange={handleChange}
              className="outline-none border-none bg-transparent"
            />
          </div>

          {
            state === "Login" && (
              <Link to={"/reset-password"} className="mb-4 text-indigo-500 cursor-pointer">Forgot password?</Link>
            )
          }

          <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium mt-2">{state}</button>
        </form>

        {
          state === "Sign Up" ? (
            <p className="text-gray-400 text-center text-xs mt-4">Already have an account?{" "}
              <Link onClick={() => setState('Login')} className="text-blue-400 cursor-pointer underline" >Login here</Link>
            </p>

          ) : (
            <p className="text-gray-400 text-center text-xs mt-4">Don't have an account?{" "}
              <Link onClick={() => setState('Sign Up')} className="text-blue-400 cursor-pointer underline">Sign up</Link>
            </p>

          )
        }
      </div>

    </div>
  );
};

export default Login;
