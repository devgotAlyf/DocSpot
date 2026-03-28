import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Contact = () => {
  const { darkMode } = useContext(AppContext)

  const cards = [
    {
      title: 'Our office',
      lines: ['Bengaluru, Karnataka', 'Tel: +91 123 456 7890', 'Email: srivastavadev626@gmail.com'],
    },
    {
      title: 'Careers at DocSpot',
      lines: ['Learn more about our teams, current openings, and how we are shaping the product experience.'],
    },
  ]

  return (
    <div className="space-y-14 py-6">
      <section className="text-center">
        <span className={`inline-flex rounded-full px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] ${darkMode ? 'bg-teal-500/10 text-teal-300 ring-1 ring-teal-500/20' : 'bg-teal-50 text-teal-700 ring-1 ring-teal-100'}`}>
          Contact Us
        </span>
        <h1 className={`mt-4 text-4xl font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          Reach the team behind DocSpot
        </h1>
        <p className={`mx-auto mt-4 max-w-2xl text-sm leading-7 md:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Questions, partnerships, or hiring conversations should feel as polished as the rest of the product.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className={`overflow-hidden rounded-[32px] border ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
          <img className="h-full w-full object-cover" src={assets.contact_image} alt="Contact DocSpot" />
        </div>

        <div className="grid gap-5">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`rounded-[28px] border p-6 md:p-7 ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-white'}`}
            >
              <p className={`text-sm font-bold uppercase tracking-[0.22em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {card.title}
              </p>
              <div className="mt-4 space-y-3">
                {card.lines.map((line) => (
                  <p key={line} className={`text-sm leading-7 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}

          <div className={`rounded-[28px] border p-6 md:p-7 ${darkMode ? 'border-teal-500/20 bg-teal-500/5' : 'border-teal-100 bg-teal-50/80'}`}>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              Want to work with us?
            </h2>
            <p className={`mt-3 text-sm leading-7 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Explore roles, introduce yourself, or start a partnership conversation with a cleaner call to action.
            </p>
            <button className={`mt-6 rounded-full px-7 py-3 text-sm font-semibold transition-all ${darkMode ? 'bg-white text-slate-950 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
              Explore Jobs
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
