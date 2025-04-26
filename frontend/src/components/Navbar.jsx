import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const Navbar = () => {

  const { userData, backendUrl, setuserData, setisLoggedin } = useContext(AppContext);

  const navigate = useNavigate()

  const logout = async () => {

    try {

      axios.defaults.withCredentials = true

      const { data } = await axios.post(backendUrl + '/api/auth/logout')

      if (data.success) {
        setisLoggedin(false)
        setuserData(false)
        toast.success("User Logout")
        navigate('/')
      }
      else {
        toast.error(data.message);
      }
    }
    catch (error) {
      toast.error(error.message);
    }
  }

  const getVerificationOtp = async() => {

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');

      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message)
      }
      else {
        toast.error(data.message);
      }
    }
    catch(error) {
      toast.error(error.message);
    }

  }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 absolute top-0'>


      <img src={assets.logo} alt='logo-img' className='w-28 sm:w-32' />


      {userData ?
        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group p-3 mx-5'>
          {userData.name[0].toUpperCase()}
          <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
              {!userData.isAccountVerified && <li onClick={getVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email</li>
              }
              <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Logout</li>
            </ul>

          </div>
        </div>
        :
        <button onClick={() => navigate('/login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-3 text-gray-800 hover:bg-gray-200 hover:scale-105 transform transition duration-200'>LOGIN
          <img src={assets.arrow_icon} />
        </button>
      }

    </div>
  )
}

export default Navbar