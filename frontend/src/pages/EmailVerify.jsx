import React, { useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'

const EmailVerify = () => {

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const { backendUrl, isloggedin, userData, setuserData, getUserData } = useContext(AppContext);


  const onSubmitHandler = async (e) => {

    try {
      e.preventDefault();

      const otpArray = inputRefs.current.map(e => e.value)

      const OTP = otpArray.join('')

      if (OTP.length < 6) {
        toast.error('Please enter all 6 digits');
        return;
      }

      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { OTP })

      if (data.success) {
        toast.success(data.message)
        getUserData()
        navigate('/')
      }
      else {
        toast.error(data.message)
        console.log(data.message)
      };
    }

    catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  }

  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e, index) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  useEffect(()=> {
    isloggedin && userData && userData.isAccountVerified && navigate('/')

  }, [isloggedin, userData])

  return (

    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-cyan-200 to-blue-400'>

      <img src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' onClick={() => navigate('/')} />

      <form className='bg-white p-8 rounded-lg shadow-lg w-98 text-sm' onSubmit={onSubmitHandler} >
        <h1 className='text-xl sm:text-3xl font-semibold text-center mb-2'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-500 text-xs'>Enter 6-Digit code sent to your Email Id</p>

        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input type='text' maxLength='1' key={index} required className='w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 text-center text-xl rounded-md' ref={e => inputRefs.current[index] = e} onInput={(e) => handleInput(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} />
          ))}
        </div>

        <button className='w-full py-3 bg-gradient-to-r from-indigo-800 to-indigo-400 text-white shadow-md rounded-full text-md cursor-pointer'>Verify Email</button>

      </form>

    </div>
  )
}

export default EmailVerify
