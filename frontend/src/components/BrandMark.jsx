import React from 'react'

const BrandMark = ({
  darkMode = false,
  compact = false,
  showTagline = false,
  onClick,
  className = '',
}) => {
  const titleSize = compact ? 'text-2xl' : 'text-3xl'
  const iconSize = compact ? 'h-11 w-11' : 'h-14 w-14'

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className={`flex items-center justify-center rounded-2xl ${compact ? 'p-1.5' : 'p-2'} ${darkMode ? 'bg-white/6 ring-1 ring-white/10' : 'bg-slate-50 ring-1 ring-slate-200/70'}`}>
        <img src="/fabicon_logo.png" alt="DocSpot mark" className={`${iconSize} object-contain`} />
      </div>
      <div className="leading-none">
        <div className={`font-extrabold tracking-tight ${titleSize}`}>
          <span className={darkMode ? 'text-slate-100' : 'text-sky-900'}>Doc</span>
          <span className="text-teal-500">Spot</span>
        </div>
        {showTagline && (
          <p className={`mt-1 text-[11px] font-medium uppercase tracking-[0.24em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Nearby Hospitals and Care
          </p>
        )}
      </div>
    </div>
  )
}

export default BrandMark
