import React, { useContext } from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const SpecialityMenu = () => {
    const { darkMode } = useContext(AppContext)

    return (
        <div id='speciality' className={`flex flex-col items-center gap-4 py-16 transition-colors duration-300 ${darkMode ? 'text-slate-100' : 'text-[#262626]'}`}>
            <h1 className='text-3xl font-medium'>Find Hospitals by Specialty</h1>
            <p className={`sm:w-1/3 text-center text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Choose a care category to explore better-matched hospitals and clinics near your location.</p>
            <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
                {specialityData.map((item, index) => (
                    <Link to={`/doctors/${item.speciality}`} onClick={() => scrollTo(0, 0)} className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={index}>
                        <img className={`w-16 sm:w-24 mb-2 rounded-2xl p-2 ${darkMode ? 'bg-slate-800/70 ring-1 ring-slate-700' : 'bg-white/80'}`} src={item.image} alt={item.speciality} />
                        <p className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{item.speciality}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SpecialityMenu
