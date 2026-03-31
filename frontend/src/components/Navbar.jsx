import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import BrandMark from './BrandMark'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData, darkMode, setDarkMode } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  return (
    <div className={`flex items-center justify-between text-sm pt-2 pb-0 border-b transition-colors duration-300 ${darkMode ? 'border-b-gray-700 bg-gray-800' : 'border-b-gray-400 bg-white'}`}>
      <BrandMark darkMode={darkMode} compact onClick={() => navigate('/')} className="py-3" />

      <ul className={`hidden md:flex items-start gap-5 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
        <li className='pb-0.5'>
          <NavLink to='/' className={({ isActive }) => isActive ? 'border-b-2 border-primary' : ''}>HOME</NavLink>
        </li>
        <li className='pb-0.5'>
          <NavLink to='/doctors' className={({ isActive }) => isActive ? 'border-b-2 border-primary' : ''}>HOSPITALS</NavLink>
        </li>
        <li className='pb-0.5'>
          <NavLink to='/about' className={({ isActive }) => isActive ? 'border-b-2 border-primary' : ''}>ABOUT</NavLink>
        </li>
        <li className='pb-0.5'>
          <NavLink to='/contact' className={({ isActive }) => isActive ? 'border-b-2 border-primary' : ''}>CONTACT</NavLink>
        </li>
      </ul>

      <div className='flex items-center gap-4'>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className='hidden md:block border px-5 py-2.5 rounded-full font-medium hover:scale-105 transition-all text-primary border-primary hover:bg-primary hover:text-white'
          title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          {darkMode ? 'Light' : 'Dark'}
        </button>

        {token && userData ? (
          <div className={`flex items-center gap-2 cursor-pointer group relative py-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            <span className={`font-bold hover:text-primary transition-colors text-lg ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Hello, {userData.name || 'User'}</span>
            <img className='w-3 ml-1 opacity-70' src={assets.dropdown_icon || '/fallback-icon.png'} alt="dropdown" />
            <div className={`absolute top-full right-0 text-base font-medium z-20 hidden group-hover:block ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
              <div className={`min-w-48 rounded flex flex-col gap-4 p-4 shadow-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-stone-100 border-gray-200'}`}>
                <p onClick={() => navigate('my-profile')} className={`hover:opacity-70 cursor-pointer ${darkMode ? 'text-gray-100' : 'hover:text-black'}`}>My Profile</p>
                <p onClick={() => navigate('my-appointments')} className={`hover:opacity-70 cursor-pointer ${darkMode ? 'text-gray-100' : 'hover:text-black'}`}>Saved Hospitals</p>
                <p onClick={logout} className={`hover:opacity-70 cursor-pointer ${darkMode ? 'text-gray-100' : 'hover:text-black'}`}>Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <div className='hidden md:flex items-center gap-4'>
            <button
              onClick={() => navigate('/login', { state: { mode: 'Login' } })}
              className='border px-6 py-2.5 rounded-full font-medium hover:scale-105 transition-all text-primary border-primary hover:bg-primary hover:text-white'
            >
              Already a user? Sign in
            </button>
            <button
              onClick={() => navigate('/login', { state: { mode: 'Sign Up' } })}
              className={`text-white px-8 py-3 rounded-full font-light hover:scale-105 transition-all ${darkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-primary hover:scale-105'}`}
            >
              Create Account
            </button>
          </div>
        )}

        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden transition-all ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-gray-900'}`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <BrandMark darkMode={darkMode} compact />
            <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded full inline-block'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded full inline-block'>HOSPITALS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded full inline-block'>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded full inline-block'>CONTACT</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
