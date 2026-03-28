import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyAppointments = () => {
  const { token, darkMode } = useContext(AppContext)
  const navigate = useNavigate()
  const [savedContacts, setSavedContacts] = useState([])

  const getHospitalImage = (hospital) => hospital.photo || hospital.image || assets.doc1
  const getHospitalTag = (hospital) => hospital.specialtyTag || hospital.speciality
  const getHospitalAddress = (hospital) => {
    if (typeof hospital.address === 'string') {
      return hospital.address
    }
    if (hospital.address?.line1 || hospital.address?.line2) {
      return [hospital.address.line1, hospital.address.line2].filter(Boolean).join(', ')
    }
    return hospital.formatted_address || 'Address not available'
  }

  useEffect(() => {
    try {
      if (token) {
        const contacts = JSON.parse(localStorage.getItem('saved_contacts')) || []
        setSavedContacts([...contacts].reverse())
      } else {
        setSavedContacts([])
      }
    } catch (error) {
      console.log('Error reading saved contacts', error)
    }
  }, [token])

  const removeContact = (hospital) => {
    try {
      const current = JSON.parse(localStorage.getItem('saved_contacts')) || []
      const updated = current.filter((item) => item.name !== hospital.name)
      localStorage.setItem('saved_contacts', JSON.stringify(updated))
      setSavedContacts([...updated].reverse())
      toast.success(`${hospital.name} removed from saved list`)
    } catch (error) {
      console.log('Error removing contact', error)
    }
  }

  if (!token) {
    return (
      <div className={`mt-20 rounded-[32px] border px-6 py-14 text-center ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
        <h2 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Please login</h2>
        <p className={`mx-auto mt-3 max-w-xl text-sm leading-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          You need an account to keep a list of saved hospitals and contact details.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="mt-6 rounded-full bg-primary px-8 py-3 text-white transition-all hover:-translate-y-0.5 hover:bg-teal-600"
        >
          Login now
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto mb-20 max-w-5xl px-4 sm:px-0">
      <div className={`mt-12 flex items-center justify-between border-b pb-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div>
          <h1 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Saved hospitals and contacts
          </h1>
          <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            A cleaner saved list for returning to nearby hospitals faster.
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${darkMode ? 'bg-teal-500/10 text-teal-300 ring-1 ring-teal-500/20' : 'bg-primary/10 text-primary'}`}>
          {savedContacts.length} Saved
        </span>
      </div>

      {savedContacts.length === 0 ? (
        <div className={`mt-8 rounded-[32px] border px-6 py-20 text-center ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
          <svg className={`mx-auto mb-4 h-16 w-16 ${darkMode ? 'text-slate-600' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>No hospitals saved yet</h2>
          <p className={`mx-auto mt-3 max-w-2xl text-sm leading-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            When you view contact details from the nearby hospitals section, they will appear here for quick access later.
          </p>
          <button
            onClick={() => navigate('/')}
            className={`mt-6 rounded-full px-6 py-3 text-sm font-semibold transition-all ${darkMode ? 'bg-slate-900 text-slate-100 ring-1 ring-slate-700 hover:bg-slate-800' : 'bg-white text-primary ring-1 ring-primary/20 hover:bg-primary hover:text-white'}`}
          >
            Find hospitals
          </button>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-6">
          {savedContacts.map((hospital, index) => (
            <div
              key={`${hospital.name}-${index}`}
              className={`flex flex-col gap-6 rounded-[30px] border p-6 transition-all duration-300 sm:flex-row sm:items-center ${darkMode ? 'border-slate-800 bg-slate-950/55 hover:border-teal-500/30' : 'border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]'}`}
            >
              <div className={`flex h-32 w-48 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border p-2 ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50'}`}>
                <img
                  className="max-h-full max-w-full object-contain"
                  src={getHospitalImage(hospital)}
                  alt={hospital.name}
                  onError={(event) => { event.target.src = assets.doc1 }}
                />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{hospital.name}</h2>
                  {getHospitalTag(hospital) && (
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${darkMode ? 'bg-teal-500/10 text-teal-300 ring-1 ring-teal-500/20' : 'bg-primary/5 text-primary ring-1 ring-primary/10'}`}>
                      {getHospitalTag(hospital)}
                    </span>
                  )}
                </div>

                <div className={`flex items-start gap-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <svg className={`mt-0.5 h-5 w-5 shrink-0 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm leading-relaxed">{getHospitalAddress(hospital)}</p>
                </div>

                <div className={`flex flex-wrap gap-3 border-t pt-4 ${darkMode ? 'border-slate-900' : 'border-slate-100'}`}>
                  {hospital.phone && (
                    <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${darkMode ? 'bg-slate-900 text-slate-200 ring-1 ring-slate-800' : 'bg-slate-50 text-slate-700 ring-1 ring-slate-100'}`}>
                      <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      {hospital.phone}
                    </div>
                  )}

                  {hospital.website && (
                    <a
                      href={hospital.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${darkMode ? 'bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20 hover:bg-sky-500/15' : 'bg-sky-50 text-sky-700 ring-1 ring-sky-100 hover:bg-sky-100'}`}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                      </svg>
                      Website
                    </a>
                  )}
                </div>
              </div>

              <div className={`flex w-full flex-col gap-3 border-t pt-4 text-sm sm:w-auto sm:shrink-0 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                {hospital.mapsUrl && (
                  <a
                    href={hospital.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full rounded-xl px-5 py-3 text-center font-semibold transition-all sm:min-w-[170px] ${darkMode ? 'bg-slate-900 text-teal-300 ring-1 ring-teal-500/20 hover:bg-slate-800' : 'bg-teal-50 text-primary ring-1 ring-primary/15 hover:bg-primary hover:text-white'}`}
                  >
                    Get directions
                  </a>
                )}

                {hospital.phone && (
                  <a
                    href={`tel:${hospital.phone}`}
                    className="w-full rounded-xl bg-primary px-5 py-3 text-center font-semibold text-white shadow-[0_12px_25px_rgba(20,184,166,0.24)] transition-all hover:-translate-y-0.5 hover:bg-teal-600 sm:min-w-[170px]"
                  >
                    Call hospital
                  </a>
                )}

                <button
                  onClick={() => removeContact(hospital)}
                  className={`w-full rounded-xl px-5 py-3 text-center font-semibold transition-all sm:min-w-[170px] ${darkMode ? 'bg-red-500/10 text-red-300 ring-1 ring-red-500/20 hover:bg-red-500/15' : 'bg-red-50 text-red-500 ring-1 ring-red-100 hover:bg-red-500 hover:text-white'}`}
                >
                  Remove from list
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAppointments
