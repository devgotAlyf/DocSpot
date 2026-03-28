import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false)
  const { userData, setUserData, loadUserProfileData, token, backendUrl, darkMode } = useContext(AppContext)

  const fieldClass = darkMode
    ? 'w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-slate-100 outline-none transition-all focus:border-teal-400'
    : 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 outline-none transition-all focus:border-primary'

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()
      formData.append('name', userData.name || '')
      formData.append('phone', userData.phone || '')
      formData.append('address', JSON.stringify(userData.address || { line1: '', line2: '' }))
      formData.append('gender', userData.gender || '')
      formData.append('dob', userData.dob || '')

      const { data } = await axios.post(
        backendUrl + '/api/user/update-profile',
        formData,
        { headers: { token } }
      )

      if (!data.success) {
        throw new Error(data.message)
      }

      toast.success('Profile updated successfully!')
      await loadUserProfileData()
      setIsEdit(false)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  if (!userData) return null

  return (
    <div className={`mx-auto my-10 max-w-4xl rounded-[36px] border p-8 transition-all duration-300 ${darkMode ? 'border-slate-800 bg-slate-950/55' : 'border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]'}`}>
      <div className={`border-b pb-8 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <p className={`text-sm font-bold uppercase tracking-[0.22em] ${darkMode ? 'text-teal-300' : 'text-primary'}`}>Patient Profile</p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full">
            {isEdit ? (
              <input
                className={`${fieldClass} max-w-md text-3xl font-bold tracking-tight`}
                type="text"
                placeholder="Your name"
                onChange={(event) => setUserData((prev) => ({ ...prev, name: event.target.value }))}
                value={userData.name}
              />
            ) : (
              <h1 className={`text-4xl font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                {userData.name}
              </h1>
            )}
            <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Cleaned up for better readability, spacing, and form contrast in both themes.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6">
        <section className={`rounded-[28px] border p-6 ${darkMode ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-slate-50/80'}`}>
          <h2 className={`text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Contact information</h2>
          <div className={`mt-6 grid grid-cols-1 gap-y-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <p className={darkMode ? 'font-semibold text-slate-400' : 'font-semibold text-slate-600'}>Email address</p>
            <p className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${darkMode ? 'bg-teal-500/10 text-teal-300 ring-1 ring-teal-500/20' : 'bg-primary/5 text-primary ring-1 ring-primary/10'}`}>
              {userData.email}
            </p>

            <p className={darkMode ? 'font-semibold text-slate-400' : 'font-semibold text-slate-600'}>Phone number</p>
            {isEdit ? (
              <input
                className={`${fieldClass} max-w-sm`}
                type="text"
                placeholder="+1 (123) 456-7890"
                onChange={(event) => setUserData((prev) => ({ ...prev, phone: event.target.value }))}
                value={userData.phone}
              />
            ) : (
              <p className={darkMode ? 'text-slate-100' : 'text-slate-800'}>{userData.phone || 'Not provided'}</p>
            )}

            <p className={`self-start pt-2 ${darkMode ? 'font-semibold text-slate-400' : 'font-semibold text-slate-600'}`}>Home address</p>
            {isEdit ? (
              <div className="space-y-3">
                <input
                  className={`${fieldClass} max-w-xl`}
                  type="text"
                  placeholder="Street address"
                  onChange={(event) => setUserData((prev) => ({ ...prev, address: { ...(prev.address || {}), line1: event.target.value } }))}
                  value={userData.address?.line1 || ''}
                />
                <input
                  className={`${fieldClass} max-w-xl`}
                  type="text"
                  placeholder="City, state, zip"
                  onChange={(event) => setUserData((prev) => ({ ...prev, address: { ...(prev.address || {}), line2: event.target.value } }))}
                  value={userData.address?.line2 || ''}
                />
              </div>
            ) : (
              <p className={`max-w-xl rounded-2xl border px-4 py-3 leading-7 ${darkMode ? 'border-slate-800 bg-slate-950 text-slate-200' : 'border-slate-200 bg-white text-slate-800'}`}>
                {userData.address?.line1 ? (
                  <>{userData.address.line1}<br />{userData.address?.line2}</>
                ) : 'No address provided'}
              </p>
            )}
          </div>
        </section>

        <section className={`rounded-[28px] border p-6 ${darkMode ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-slate-50/80'}`}>
          <h2 className={`text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Basic information</h2>
          <div className={`mt-6 grid grid-cols-1 gap-y-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <p className={darkMode ? 'font-semibold text-slate-400' : 'font-semibold text-slate-600'}>Gender</p>
            {isEdit ? (
              <select
                className={`${fieldClass} max-w-[170px]`}
                onChange={(event) => setUserData((prev) => ({ ...prev, gender: event.target.value }))}
                value={userData.gender}
              >
                <option value="Not Selected">Not Selected</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className={darkMode ? 'text-slate-100' : 'text-slate-800'}>{userData.gender || 'Not specified'}</p>
            )}

            <p className={darkMode ? 'font-semibold text-slate-400' : 'font-semibold text-slate-600'}>Birthday</p>
            {isEdit ? (
              <input
                className={`${fieldClass} max-w-[220px]`}
                type="date"
                onChange={(event) => setUserData((prev) => ({ ...prev, dob: event.target.value }))}
                value={userData.dob}
              />
            ) : (
              <p className={darkMode ? 'text-slate-100' : 'text-slate-800'}>{userData.dob || 'Not specified'}</p>
            )}
          </div>
        </section>
      </div>

      <div className="mt-10 flex justify-end">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="rounded-xl bg-primary px-10 py-3.5 font-bold tracking-wide text-white shadow-[0_12px_25px_rgba(20,184,166,0.24)] transition-all hover:-translate-y-0.5 hover:bg-teal-600"
          >
            Save profile
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className={`rounded-xl px-10 py-3.5 font-bold tracking-wide transition-all ${darkMode ? 'bg-slate-900 text-slate-100 ring-1 ring-slate-700 hover:bg-slate-800' : 'bg-white text-primary ring-2 ring-primary/20 hover:bg-primary/5'}`}
          >
            Edit profile
          </button>
        )}
      </div>
    </div>
  )
}

export default MyProfile
