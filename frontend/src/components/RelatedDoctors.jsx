import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import DoctorCard from './DoctorCard'
import { specialityMatches } from '../utils/doctors'

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors, darkMode } = useContext(AppContext)
  const navigate = useNavigate()
  const [relDoc, setRelDoc] = useState([])

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => specialityMatches(doc.speciality, speciality) && doc._id !== docId
      )
      setRelDoc(doctorsData)
    }
  }, [doctors, speciality, docId])

  if (!relDoc.length) return null

  return (
    <section className="my-16">
      <div className="text-center">
        <h2 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          Related doctors
        </h2>
        <p className={`mx-auto mt-3 max-w-2xl text-sm leading-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          More specialists in the same field, styled consistently so it is easier to compare and book quickly.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {relDoc.map((item) => (
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

export default RelatedDoctors
