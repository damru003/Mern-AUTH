import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {

    const navigate = useNavigate();

    const { userData } = useContext(AppContext);

    return (
        <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800s'>
            <img src={assets.header_img}
                className='w-36 h-36 rounded-full mb-6'
                alt='header-imgs' />
            <h1 className='flex items-center gap-2 text-3xl font-medium mb-2'>Hey, {userData ? userData.name : "Developer"}
                <img src={assets.hand_wave} className='w-8 aspect-square' />
            </h1>
            <h2 className='text-2xl md:text-5xl font-semibold mt-2 mb-4'>Welcome aboard 🚀 — We're excited to have you!</h2>
            <p className='max-w-md mb-2 mt-2'>Let's kick things off with a quick product tour 🎯 —</p>
            <p className='max-w-md mb-8 mt-2'>Get ready to explore amazing features and make the most out of your journey with us! 🌟</p>
            <button onClick={() => navigate('/login')} className='border border-gray-500 rounded-full px-8 py-3 hover:bg-gray-100 hover:scale-105 transform transition duration-200'>Get Started</button>
        </div>
    )
}

export default Header
