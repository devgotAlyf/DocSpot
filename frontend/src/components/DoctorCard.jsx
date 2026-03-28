import React from 'react'

const DoctorCard = ({ doctor, darkMode = false, onClick }) => {
  const isAvailable = doctor.available !== false
  const availabilityClass = isAvailable
    ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
    : darkMode
      ? 'bg-slate-800 text-slate-400 ring-1 ring-slate-700'
      : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'

  return (
    <article
      onClick={onClick}
      className={`group overflow-hidden rounded-[28px] border cursor-pointer transition-all duration-500 hover:-translate-y-2 ${
        darkMode
          ? 'border-slate-800 bg-slate-900/80 shadow-[0_20px_60px_rgba(2,6,23,0.35)] hover:border-teal-500/40'
          : 'border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:border-teal-200'
      }`}
    >
      <div className={`relative overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
        <img
          className="h-60 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          src={doctor.image}
          alt={doctor.name}
        />
        <div className="absolute left-4 top-4">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${availabilityClass}`}>
            <span className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-emerald-400' : darkMode ? 'bg-slate-500' : 'bg-slate-400'}`}></span>
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div className="space-y-1">
          <p className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${darkMode ? 'bg-slate-800 text-slate-300 ring-1 ring-slate-700' : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'}`}>
            {doctor.speciality}
          </p>
          <h3 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            {doctor.name}
          </h3>
        </div>

        <p className={`text-sm leading-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {doctor.degree} with {doctor.experience} of experience in patient-focused care.
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className={`text-sm font-medium ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            View profile
          </span>
          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            darkMode ? 'bg-teal-500/15 text-teal-300 group-hover:bg-teal-500/25' : 'bg-teal-50 text-teal-600 group-hover:bg-teal-100'
          }`}>
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>
    </article>
  )
}

export default DoctorCard
