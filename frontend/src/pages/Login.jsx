import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {

  const navigate = useNavigate()

  const { backendUrl, setisLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {

    try {
      e.preventDefault();

      axios.defaults.withCredentials = true

      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password })

        if (data.success) {
          setisLoggedin(true)
          toast.success('Account created successfully!');
          getUserData();
          navigate('/')
        }
        else{
          alert(data.message);
        }

        console.log('Signup Success:', data);
      }
      else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password });

        if (data.success) {
          setisLoggedin(true)
          toast.success('Login successfully!')
          getUserData()
          navigate('/')
        }
        else{
          toast.error(data.message);
        }
      }
    }
    catch (error) {
      toast.error('Auth Error:', error.message);
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-cyan-200 to-blue-400 relative'>
      <img src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' onClick={() => navigate('/')} />

      <div className='flex flex-col items-center gap-2 bg-white p-8 rounded-xl shadow-lg w-full max-w-md'>
        <h2 className='text-3xl font-semibold text-center mb-2'>{state === 'Sign Up' ? 'Create Account' : 'LOGIN'}</h2>
        <p className='text-center text-sm mb-4 text-gray-600'>{state === 'Sign Up' ? 'Create Your Account' : 'Login to Your Account'}</p>

        <form onSubmit={onSubmitHandler} className='w-full flex flex-col gap-4'>

          {state === 'Sign Up' && (<div className='flex items-center border rounded-full px-3 py-2 bg-gray-50'>
            <img src={assets.person_icon} alt='person-icon' className='w-5 h-5 ml-1 mr-2' />
            <input type='text' placeholder='Enter Full Name' className='outline-none bg-transparent w-full' required onChange={e => setName(e.target.value)} value={name} />
          </div>)}



          <div className='flex items-center border rounded-full px-3 py-2 bg-gray-50'>
            <img src={assets.mail_icon} alt='person-icon' className='w-5 h-5 ml-1 mr-2' />
            <input type='email' placeholder='Enter Email Address' className='outline-none bg-transparent w-full' required onChange={e => setEmail(e.target.value)} value={email} />
          </div>

          <div className='flex items-center border rounded-full px-3 py-2 bg-gray-50'>
            <img src={assets.lock_icon} alt='person-icon' className='w-5 h-5 ml-1 mr-2' />
            <input type='password' placeholder='Enter Password' className='outline-none bg-transparent w-full' required onChange={e => setPassword(e.target.value)} value={password} />
          </div>

          <p onClick={() => navigate('/reset-password')} className='mb-0 text-indigo-900 cursor-pointer'>Forgot Password ?</p>

          <button className='w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium cursor-pointer'>{state}</button>

        </form>

        {state === 'Sign Up' ? (<p className='text-gray-400 text-center text-xs mt-2'>Already Have an Account ? <span onClick={() => setState('Login')} className='cursor-pointer text-blue-400'>Login Here</span></p>) : (<p className='text-gray-400 text-center text-xs mt-2'>Don't Have an Account ? <span onClick={() => setState('Sign Up')} className='cursor-pointer text-blue-400'>Sign Up</span></p>)}




      </div>
    </div>
  )
}

export default Login;
