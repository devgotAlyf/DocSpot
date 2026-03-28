import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from './context/AppContext'
import { assets } from './assets/assets'
import RelatedDoctors from './components/RelatedDoctors'
import NearbyDoctors from './components/NearbyDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'
import { canonicalizeSpeciality } from './utils/doctors'

const Appointment = () => {
  const { docId } = useParams()
  const navigate = useNavigate()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData, darkMode, isDoctorsReady } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = async () => {
    const doc = doctors.find((doctor) => doctor._id === docId)
    if (doc) {
      setDocInfo({ ...doc, slots_booked: doc.slots_booked || {} })
    }
  }

  const getAvailableSlots = () => {
    if (!docInfo) return

    const today = new Date()
    const nextSlots = []

    for (let i = 0; i < 7; i += 1) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      const endTime = new Date(currentDate)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      const timeSlots = []

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })

        const day = currentDate.getDate()
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()
        const slotDate = `${day}_${month}_${year}`

        const isSlotAvailable =
          !docInfo?.slots_booked?.[slotDate] ||
          !docInfo.slots_booked[slotDate].includes(formattedTime)

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      nextSlots.push(timeSlots)
    }

    setDocSlots(nextSlots)
    setSlotIndex(0)
    setSlotTime('')
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Login to book appointment')
      navigate('/login')
      return
    }

    const selectedDaySlots = docSlots[slotIndex] || []

    if (!selectedDaySlots.length) {
      toast.warning('No slots are available for the selected day')
      return
    }

    if (!slotTime) {
      toast.warning('Please choose a time slot before booking')
      return
    }

    const chosenSlot = selectedDaySlots.find((slot) => slot.time === slotTime) || selectedDaySlots[0]
    const date = chosenSlot.datetime

    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const slotDate = `${day}_${month}_${year}`

    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate, slotTime },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo()
    }
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots()
    }
  }, [docInfo])

  useEffect(() => {
    setSlotTime('')
  }, [slotIndex])

  if (!docInfo) {
    if (!isDoctorsReady) {
      return (
        <section className={`rounded-[32px] border px-6 py-14 text-center ${darkMode ? 'border-slate-800 bg-slate-950/50 text-slate-300' : 'border-slate-200 bg-white text-slate-700 shadow-[0_18px_50px_rgba(15,23,42,0.08)]'}`}>
          <p className={`text-sm font-bold uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Doctor profile
          </p>
          <h1 className={`mt-3 text-3xl font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Loading doctor profile...
          </h1>
          <p className={`mx-auto mt-4 max-w-2xl text-sm leading-7 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            We&apos;re syncing the latest directory details before showing this appointment page.
          </p>
        </section>
      )
    }

    return (
      <section className={`rounded-[32px] border px-6 py-14 text-center ${darkMode ? 'border-slate-800 bg-slate-950/50 text-slate-300' : 'border-slate-200 bg-white text-slate-700 shadow-[0_18px_50px_rgba(15,23,42,0.08)]'}`}>
        <p className={`text-sm font-bold uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Doctor profile
        </p>
        <h1 className={`mt-3 text-3xl font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          We couldn&apos;t load that doctor profile.
        </h1>
        <p className={`mx-auto mt-4 max-w-2xl text-sm leading-7 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          The selected doctor may no longer be available in the current list. Browse the directory again and pick another specialist.
        </p>
        <button
          onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
          className="mt-6 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(20,184,166,0.28)] transition-all hover:-translate-y-0.5 hover:bg-teal-600"
        >
          Back to doctors
        </button>
      </section>
    )
  }

  const selectedDaySlots = docSlots[slotIndex] || []

  return (
    <div className="space-y-12">
      <section className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className={`overflow-hidden rounded-[32px] border ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
          <img className="h-full w-full object-cover object-top" src={docInfo.image} alt={docInfo.name} />
        </div>

        <div className={`rounded-[32px] border p-6 md:p-8 ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]'}`}>
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {docInfo.name}
                </h1>
                <img src={assets.verified_icon} alt="Verified" className="h-6 w-6" />
              </div>

              <div className={`mt-3 flex flex-wrap items-center gap-3 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <span>{docInfo.degree}</span>
                <span className={darkMode ? 'text-slate-600' : 'text-slate-300'}>|</span>
                <span>{docInfo.speciality}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${darkMode ? 'bg-slate-900 text-slate-300 ring-1 ring-slate-700' : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'}`}>
                  {docInfo.experience}
                </span>
              </div>
            </div>

            <div className={`rounded-[24px] px-5 py-4 ${darkMode ? 'bg-teal-500/10 text-slate-100 ring-1 ring-teal-500/20' : 'bg-teal-50 text-slate-900 ring-1 ring-teal-100'}`}>
              <p className={`text-xs font-bold uppercase tracking-[0.2em] ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                Consultation Fee
              </p>
              <p className="mt-2 text-2xl font-bold">
                {currencySymbol} {docInfo.fees}
              </p>
            </div>
          </div>

          <div className={`mt-6 rounded-[28px] border p-5 ${darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-slate-50/80'}`}>
            <div className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              About
              <img src={assets.info_icon} alt="" className="h-4 w-4" />
            </div>
            <p className={`mt-3 max-w-3xl text-sm leading-7 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {docInfo.about}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className={`rounded-full px-4 py-2 text-sm font-semibold ${darkMode ? 'bg-slate-900 text-slate-300 ring-1 ring-slate-700' : 'bg-white text-slate-700 ring-1 ring-slate-200'}`}>
              {docInfo.speciality}
            </span>
            <span className={`rounded-full px-4 py-2 text-sm font-semibold ${darkMode ? 'bg-slate-900 text-slate-300 ring-1 ring-slate-700' : 'bg-white text-slate-700 ring-1 ring-slate-200'}`}>
              {docInfo.degree}
            </span>
          </div>
        </div>
      </section>

      <section className={`rounded-[32px] border p-6 md:p-8 ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]'}`}>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              Booking slots
            </h2>
            <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Choose a day first, then lock in a time that works for you.
            </p>
          </div>
          <p className={`text-sm font-medium ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            30 minute slots
          </p>
        </div>

        <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
          {docSlots.map((item, index) => {
            const active = slotIndex === index
            const hasSlots = item.length > 0

            return (
              <button
                type="button"
                onClick={() => setSlotIndex(index)}
                key={`${index}-${item[0]?.time || 'empty'}`}
                className={`min-w-[88px] rounded-[24px] px-4 py-4 text-center transition-all ${
                  active
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-[0_12px_30px_rgba(20,184,166,0.28)]'
                    : darkMode
                      ? 'bg-slate-900 text-slate-300 ring-1 ring-slate-800 hover:text-slate-100'
                      : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-white'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em]">
                  {item[0] ? daysOfWeek[item[0].datetime.getDay()] : 'Soon'}
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {item[0] ? item[0].datetime.getDate() : '-'}
                </p>
                <p className={`mt-1 text-[11px] font-semibold ${active ? 'text-white/80' : hasSlots ? darkMode ? 'text-emerald-400' : 'text-emerald-600' : darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {hasSlots ? `${item.length} slots` : 'Unavailable'}
                </p>
              </button>
            )
          })}
        </div>

        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {selectedDaySlots.length > 0 ? (
            selectedDaySlots.map((item) => (
              <button
                type="button"
                onClick={() => setSlotTime(item.time)}
                key={item.time}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition-all ${
                  item.time === slotTime
                    ? 'bg-primary text-white shadow-[0_10px_25px_rgba(20,184,166,0.24)]'
                    : darkMode
                      ? 'bg-slate-900 text-slate-300 ring-1 ring-slate-800 hover:text-slate-100'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
                }`}
              >
                {item.time.toLowerCase()}
              </button>
            ))
          ) : (
            <div className={`rounded-2xl px-4 py-3 text-sm ${darkMode ? 'bg-slate-900 text-slate-400 ring-1 ring-slate-800' : 'bg-slate-50 text-slate-600 ring-1 ring-slate-200'}`}>
              No available slots for this day. Try another date.
            </div>
          )}
        </div>

        <button
          onClick={bookAppointment}
          disabled={!selectedDaySlots.length || !slotTime}
          className={`mt-8 rounded-full px-8 py-3.5 text-sm font-semibold transition-all ${
            !selectedDaySlots.length || !slotTime
              ? 'cursor-not-allowed bg-slate-400/40 text-white'
              : 'bg-primary text-white shadow-[0_12px_30px_rgba(20,184,166,0.28)] hover:-translate-y-0.5 hover:bg-teal-600'
          }`}
        >
          Book an appointment
        </button>
      </section>

      <RelatedDoctors speciality={canonicalizeSpeciality(docInfo.speciality)} docId={docId} />
      <NearbyDoctors specialty={canonicalizeSpeciality(docInfo.speciality)} />
    </div>
  )
}

export default Appointment
