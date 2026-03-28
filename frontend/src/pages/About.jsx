import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const About = () => {
  const { darkMode } = useContext(AppContext)
  const highlights = [
    {
      title: 'Efficiency',
      text: 'Streamlined hospital discovery and care planning that fits neatly into daily life instead of adding friction.',
    },
    {
      title: 'Convenience',
      text: 'Nearby hospital discovery, clear specialties, and faster access to the right care hub.',
    },
    {
      title: 'Personalization',
      text: 'Smarter saved hospitals and reminders that make it easy to return to care when needed.',
    },
  ]

  return (
    <div className="space-y-14 py-6">
      <section className="text-center">
        <span className={`inline-flex rounded-full px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] ${darkMode ? 'bg-teal-500/10 text-teal-300 ring-1 ring-teal-500/20' : 'bg-teal-50 text-teal-700 ring-1 ring-teal-100'}`}>
          About Us
        </span>
        <h1 className={`mt-4 text-4xl font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          Healthcare booking that feels calmer and clearer
        </h1>
        <p className={`mx-auto mt-4 max-w-3xl text-sm leading-7 md:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          DocSpot helps people discover trusted care, compare specialists, and book appointments with less confusion and better visual clarity across the experience.
        </p>
      </section>

      <section className={`grid gap-8 overflow-hidden rounded-[32px] border p-6 md:grid-cols-[360px_minmax(0,1fr)] md:p-8 ${darkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/70'}`}>
        <div className={`overflow-hidden rounded-[28px] ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
          <img className="h-full w-full object-cover" src={assets.about_image} alt="About DocSpot" />
        </div>

        <div className="space-y-6">
          <div className={`rounded-[28px] border p-6 ${darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'}`}>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>What we are building</h2>
            <p className={`mt-3 text-sm leading-7 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Welcome to DocSpot, your partner for finding trusted hospitals, comparing nearby care options, and reaching the right facility without unnecessary friction.
            </p>
            <p className={`mt-3 text-sm leading-7 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Our platform keeps improving through better nearby search, clearer hospital cards, and smoother decision-making so users can focus more on care and less on navigation.
            </p>
          </div>

          <div className={`rounded-[28px] border p-6 ${darkMode ? 'border-teal-500/20 bg-teal-500/5' : 'border-teal-100 bg-teal-50/80'}`}>
            <p className={`text-sm font-bold uppercase tracking-[0.2em] ${darkMode ? 'text-teal-300' : 'text-teal-700'}`}>Our Vision</p>
            <p className={`mt-3 text-sm leading-7 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              We aim to create a hospital-first healthcare experience that feels seamless from discovery to contact and directions, helping patients access the right care at the right time with less uncertainty.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6">
          <p className={`text-sm font-bold uppercase tracking-[0.22em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Why choose DocSpot</p>
          <h2 className={`mt-2 text-3xl font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>A more considered product experience</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className={`rounded-[28px] border p-6 transition-all duration-300 hover:-translate-y-1 ${darkMode ? 'border-slate-800 bg-slate-950/60 hover:border-teal-500/30' : 'border-slate-200 bg-white hover:border-teal-200'}`}
            >
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${darkMode ? 'bg-teal-500/10 text-teal-300' : 'bg-teal-50 text-teal-600'}`}>
                {item.title.slice(0, 1)}
              </div>
              <h3 className={`mt-5 text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{item.title}</h3>
              <p className={`mt-3 text-sm leading-7 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default About
