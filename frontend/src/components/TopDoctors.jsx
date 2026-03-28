import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import DoctorCard from './DoctorCard'

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors, darkMode } = useContext(AppContext)

  return (
    <section className={`my-16 rounded-[32px] border px-5 py-8 md:px-8 ${darkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/70'}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className={`inline-flex rounded-full px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] ${darkMode ? 'bg-teal-500/10 text-teal-300 ring-1 ring-teal-500/20' : 'bg-teal-50 text-teal-700 ring-1 ring-teal-100'}`}>
            Top Picks
          </span>
          <h2 className={`mt-4 text-3xl font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Top doctors to book with confidence
          </h2>
          <p className={`mt-3 text-sm leading-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Browse standout profiles with clearer specialties, richer cards, and a calmer visual hierarchy in both light and dark mode.
          </p>
        </div>
        <button
          onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
          className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all ${darkMode ? 'bg-slate-900 text-slate-100 ring-1 ring-slate-700 hover:bg-slate-800' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'}`}
        >
          View all doctors
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
        {doctors.slice(0, 10).map((item) => (
          <DoctorCard
            key={item._id}
            doctor={item}
            darkMode={darkMode}
            onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
          />
        ))}
      </div>
    </section>
  )
}

export default TopDoctors
