import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import MyProfile from './pages/MyProfile'
import MyAppointment from './pages/MyAppointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from './context/AppContext'

const App = () => {
  const { darkMode } = useContext(AppContext)
  const location = useLocation()
  const isAuthPage = location.pathname === '/login'

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'}`}>
      <div className={isAuthPage ? 'min-h-screen' : 'mx-4 sm:mx-[10%] min-h-screen'}>
        <ToastContainer />
        {!isAuthPage && <Navbar />}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/my-appointments' element={<MyAppointment />} />
          <Route path='/appointment/:docId' element={<Navigate to='/doctors' replace />} />
        </Routes>
        {!isAuthPage && <Footer />}
      </div>
    </div>
  )
}

export default App
