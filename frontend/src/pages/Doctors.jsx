import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import NearbyDoctors from '../components/NearbyDoctors'
import { specialityData } from '../assets/assets'
import { canonicalizeSpeciality, specialityMatches } from '../utils/doctors'

const Doctors = () => {
  const { speciality } = useParams()
  const navigate = useNavigate()
  const { darkMode, token } = useContext(AppContext)
  const [showFilter, setShowFilter] = useState(false)

  const activeSpeciality = canonicalizeSpeciality(speciality)
  const specialties = specialityData.map((item) => item.speciality)

  return (
    <div className="space-y-8">
      <section className={`rounded-[32px] border px-6 py-8 md:px-8 ${darkMode ? 'border-slate-800 bg-[radial-gradient(circle_at_top,#0f172a,#020617)]' : 'border-slate-200 bg-[radial-gradient(circle_at_top,#f8fffe,#eff6ff)]'}`}>
        <span className={`inline-flex rounded-full px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] ${darkMode ? 'bg-teal-500/10 text-teal-300 ring-1 ring-teal-500/20' : 'bg-teal-50 text-teal-700 ring-1 ring-teal-100'}`}>
          Hospital Finder
        </span>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className={`text-3xl font-bold tracking-tight md:text-4xl ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              Find nearby hospitals with faster, cleaner specialty filters
            </h1>
            <p className={`mt-3 text-sm leading-6 md:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Filter by specialty, see ratings, and unlock contact details plus directions only after login. This page now focuses only on hospitals, clinics, and medical centers near you.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className={`min-w-[160px] rounded-2xl px-4 py-3 ${darkMode ? 'bg-slate-900/80 ring-1 ring-slate-800' : 'bg-white ring-1 ring-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Focus
              </p>
              <p className={`mt-1 text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                {activeSpeciality || 'All hospitals'}
              </p>
            </div>
            <div className={`min-w-[180px] rounded-2xl px-4 py-3 ${darkMode ? 'bg-slate-900/80 ring-1 ring-slate-800' : 'bg-white ring-1 ring-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Access
              </p>
              <p className={`mt-1 text-sm font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                {token ? 'Directions and contacts unlocked' : 'Login required for contacts'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className={`rounded-[28px] border p-5 ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50/80'}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className={`text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Hospital specialties</h2>
              <p className={`mt-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Narrow nearby hospitals by care type.
              </p>
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : darkMode ? 'bg-slate-900 text-slate-200 ring-1 ring-slate-700' : 'bg-white text-slate-700 ring-1 ring-slate-200'}`}
            >
              {showFilter ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className={`mt-5 gap-3 ${showFilter ? 'grid' : 'hidden sm:grid'}`}>
            {specialties.map((label) => {
              const active = specialityMatches(activeSpeciality, label)
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => active ? navigate('/doctors') : navigate(`/doctors/${label}`)}
                  className={`w-full rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-[0_12px_30px_rgba(20,184,166,0.28)]'
                      : darkMode
                        ? 'border border-slate-700 bg-slate-900 text-slate-300 hover:border-teal-500/40 hover:text-slate-100'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              )
            })}

            {activeSpeciality && (
              <button
                type="button"
                onClick={() => navigate('/doctors')}
                className={`mt-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${darkMode ? 'bg-slate-950 text-slate-300 ring-1 ring-slate-800 hover:text-slate-100' : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200'}`}
              >
                Show all hospitals
              </button>
            )}
          </div>
        </aside>

        <section className="space-y-6">
          <div className={`grid gap-4 md:grid-cols-2`}>
            <div className={`rounded-[28px] border p-5 ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]'}`}>
              <p className={`text-xs font-bold uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                What you get
              </p>
              <h3 className={`mt-3 text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                Nearby hospitals, ratings, contacts, and directions
              </h3>
              <p className={`mt-3 text-sm leading-7 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                We now show hospital and clinic results only. Ratings are visible immediately, while phone numbers, website links, and directions unlock after login.
              </p>
            </div>

            <div className={`rounded-[28px] border p-5 ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]'}`}>
              <p className={`text-xs font-bold uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Quick actions
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${darkMode ? 'bg-slate-900 text-slate-100 ring-1 ring-slate-700 hover:bg-slate-800' : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200'}`}
                >
                  Back to home
                </button>
                {!token && (
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(20,184,166,0.28)] transition-all hover:-translate-y-0.5 hover:bg-teal-600"
                  >
                    Login for contact access
                  </button>
                )}
              </div>
            </div>
          </div>

          <NearbyDoctors specialty={activeSpeciality} />
        </section>
      </div>
    </div>
  )
}

export default Doctors
