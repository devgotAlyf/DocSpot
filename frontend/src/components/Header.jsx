import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Header = () => {
    const { darkMode } = useContext(AppContext)

    return (
        <div className={`flex flex-col md:flex-row flex-wrap rounded-lg px-6 md:px-10 lg:px-20 ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-6 py-10 m-auto md:py-[10vw]'>
                <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[#008F82] text-[11px] font-bold tracking-widest shadow-sm ${darkMode ? 'bg-gray-700/50' : 'bg-[#e0f1fe]'}`}>
                    TRUSTED HEALTHCARE
                </div>

                <div className="space-y-2">
                    <h1 className={`text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        Find Nearby
                    </h1>
                    <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-[#008F82]">
                        Hospitals and Clinics
                    </h2>
                </div>

                <p className={`text-lg leading-relaxed max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Explore trusted hospitals around you, compare specialties, and unlock directions plus contact details with a cleaner hospital-first experience.
                </p>

                <a href="#speciality" className="inline-flex items-center justify-center bg-[#008F82] text-white rounded-full px-12 py-4 font-semibold text-lg hover:bg-[#00685e] transition-all active:scale-95 shadow-xl shadow-teal-700/20">
                    Explore Hospitals
                </a>
            </div>

            <div className='md:w-1/2 relative mt-8 md:mt-0 flex items-center justify-center py-10'>
                <div className="relative w-full max-w-sm mx-auto aspect-[4/5]">
                    <div className="relative w-full h-full rounded-[2rem] bg-gradient-to-br from-[#b2dfdb] via-[#26a69a] to-[#b2dfdb] shadow-[0_20px_50px_rgba(0,143,130,0.2)] overflow-hidden">
                        <img
                            className="absolute inset-0 w-full h-full object-cover z-10"
                            src={assets.custom_hero_doctor}
                            alt="Healthcare facility"
                        />

                        <div className="absolute bottom-[20%] right-0 w-[40%] h-[25%] bg-[#4DB6AC] z-20"></div>

                        <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 shadow-xl border border-white/50 z-30">
                            <div className="bg-[#008F82]/10 w-10 h-10 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-[#008F82]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L13.09 8.26L19 7L15.45 11.77L21 14.27L15 14.9L16 21L12 17.27L8 21L9 14.9L3 14.27L8.55 11.77L5 7L10.91 8.26L12 2Z"/>
                                </svg>
                            </div>
                            <div>
                                <div className="text-[#008F82] font-extrabold text-[10px] tracking-[0.1em] uppercase leading-none mb-1">VERIFIED</div>
                                <div className="text-gray-900 font-bold text-sm leading-tight">Trusted Hospitals</div>
                            </div>
                        </div>

                        <div className="absolute top-6 right-6 bg-white/50 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/30 z-30">
                            <div className="flex items-end gap-1.5 h-6">
                                <div className="w-1.5 bg-[#008F82]/30 h-3 rounded-full"></div>
                                <div className="w-1.5 bg-[#008F82]/50 h-5 rounded-full"></div>
                                <div className="w-1.5 bg-[#008F82] h-6 rounded-full"></div>
                                <div className="w-1.5 bg-[#008F82]/70 h-4 rounded-full"></div>
                                <div className="w-1.5 bg-[#008F82]/40 h-5 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
