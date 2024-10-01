import React from 'react'
import {assets} from '../assets/assets'

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
        <img className='w-20' src={assets.logo} alt="logo" />
        <p className='lg:text-2xl md:text-xl sm:text-lg text-gray-500'>Paragon Admin Panel</p>
        <button onClick={()=>setToken("")} className='bg-black text-white px-5 py-2 sm:px-7 sm:py-2 rounded-xl'>Logout</button>
    </div>
  )
}

export default Navbar