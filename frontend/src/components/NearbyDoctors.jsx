import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const NearbyDoctors = ({ specialty }) => {
  const { backendUrl, userLocation: contextLocation, token, darkMode } = useContext(AppContext)
  const navigate = useNavigate()
  const [locationState, setLocationState] = useState('idle')
  const [nearbyDoctors, setNearbyDoctors] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [localLocation, setLocalLocation] = useState(null)

  const saveHospital = (doctor) => {
    try {
      let existingContacts = []
      try {
        existingContacts = JSON.parse(localStorage.getItem('saved_contacts')) || []
      } catch (error) {
        existingContacts = []
      }

      const exists = existingContacts.some((hospital) => hospital.name === doctor.name && hospital.address === doctor.address)
      if (!exists) {
        existingContacts.push(doctor)
        localStorage.setItem('saved_contacts', JSON.stringify(existingContacts))
      }
    } catch (error) {
      console.log('Error saving hospital contact:', error)
    }
  }

  const handleLoginRedirect = (event) => {
    event.preventDefault()
    event.stopPropagation()
    navigate('/login')
  }

  const handleProtectedAction = (doctor, event) => {
    event.stopPropagation()
    saveHospital(doctor)
  }

  const specialtyDescriptions = {
    'General physician': 'Nearby hospitals and clinics that support general medicine, routine care, and everyday consultations.',
    'Gynecologist': 'Nearby hospitals and women\'s health clinics focused on gynecology, obstetrics, and maternity care.',
    'Dermatologist': 'Nearby hospitals and skin-care clinics for dermatology, cosmetic care, and related treatment.',
    'Pediatricians': 'Nearby hospitals and pediatric care centers for infants, children, and adolescents.',
    'Neurologist': 'Nearby hospitals and specialty centers supporting neurology and nervous-system treatment.',
    'Gastroenterologist': 'Nearby hospitals and digestive-care centers for gastroenterology and GI treatment.',
  }

  const specialtyTitles = {
    'General physician': 'General Medicine Hospitals',
    'Gynecologist': 'Gynecology Hospitals',
    'Dermatologist': 'Dermatology Hospitals',
    'Pediatricians': 'Pediatric Care Hospitals',
    'Neurologist': 'Neurology Hospitals',
    'Gastroenterologist': 'Gastroenterology Hospitals',
  }

  const fetchApproxLocation = async () => {
    try {
      const { data } = await axios.get('https://get.geojs.io/v1/ip/geo.json')
      if (data && data.latitude && data.longitude) {
        return {
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude)
        }
      }
    } catch (err) {
      console.log('IP geo fallback failed', err.message)
    }

    return null
  }

  const requestLocation = async () => {
    setLocationState('prompting')

    if (!navigator.geolocation) {
      const approxLocation = await fetchApproxLocation()
      if (approxLocation) {
        setLocalLocation(approxLocation)
        setLocationState('loading')
        fetchNearbyDoctors(approxLocation)
      } else {
        setLocationState('error')
        setErrorMsg('Geolocation is not supported by your browser.')
      }
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setLocalLocation(coords)
        setLocationState('loading')
        fetchNearbyDoctors(coords)
      },
      async (error) => {
        const approxLocation = await fetchApproxLocation()
        if (approxLocation) {
          setLocalLocation(approxLocation)
          setLocationState('loading')
          fetchNearbyDoctors(approxLocation)
        } else if (error.code === 1 || error.code === error.PERMISSION_DENIED) {
          setLocationState('denied')
        } else {
          setLocationState('error')
          setErrorMsg('Unable to retrieve your location. Please try again.')
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    )
  }

  const fetchNearbyDoctors = async (coords) => {
    try {
      const params = { lat: coords.lat, lng: coords.lng }
      if (specialty) params.specialty = specialty

      const { data } = await axios.get(backendUrl + '/api/nearby-doctors', { params })

      if (data.success) {
        setNearbyDoctors(data.nearbyDoctors)
        setLocationState('success')
      } else {
        setLocationState('error')
        setErrorMsg(data.message || 'Failed to find nearby hospitals.')
      }
    } catch (error) {
      console.error('Error fetching nearby hospitals:', error)
      setLocationState('error')
      const backendMsg = error.response?.data?.message
      setErrorMsg(backendMsg || error.message || 'Failed to fetch nearby hospitals. Please try again.')
    }
  }

  useEffect(() => {
    const coordsToUse = contextLocation || localLocation
    if (coordsToUse) {
      if (locationState !== 'loading') {
        setLocationState('loading')
        fetchNearbyDoctors(coordsToUse)
      }
    } else {
      requestLocation()
    }
  }, [specialty, contextLocation])

  const renderStars = (rating) => {
    if (!rating) return null

    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating - fullStars >= 0.3

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="nearby-star nearby-star-filled" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <svg key={i} className="nearby-star nearby-star-half" viewBox="0 0 20 20" fill="currentColor">
            <defs>
              <linearGradient id={`halfGrad-${i}`}>
                <stop offset="50%" stopColor="#FBBF24" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path fill={`url(#halfGrad-${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      } else {
        stars.push(
          <svg key={i} className="nearby-star nearby-star-empty" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      }
    }

    return stars
  }

  const getPhotoUrl = (photoRef) => {
    if (!photoRef) return null
    return `${backendUrl}/api/nearby-doctors/photo?ref=${photoRef}`
  }

  const getSpecialtyDescription = () => {
    if (specialty && specialtyDescriptions[specialty]) {
      return specialtyDescriptions[specialty]
    }
    return 'Find verified hospitals, clinics, and medical centers near your current location.'
  }

  const getSpecialtyTitle = () => {
    if (specialty && specialtyTitles[specialty]) {
      return specialtyTitles[specialty]
    }

    if (specialty) {
      return `${specialty} Hospitals`
    }

    return 'Nearby Hospitals'
  }

  const getLoadingLabel = () => {
    if (specialty && specialtyTitles[specialty]) {
      return specialtyTitles[specialty].toLowerCase()
    }

    if (specialty) {
      return `${specialty.toLowerCase()} hospitals`
    }

    return 'hospitals'
  }

  if (locationState === 'idle') return null

  return (
    <div className={`nearby-doctors-section ${darkMode ? 'nearby-dark' : ''}`}>
      <div className="nearby-header">
        <div className="nearby-header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div>
          <h2 className="nearby-title">
            {getSpecialtyTitle()}
          </h2>
          <p className="nearby-subtitle">{getSpecialtyDescription()}</p>
        </div>
      </div>

      {(locationState === 'prompting' || locationState === 'loading') && (
        <div className="nearby-loading-container">
          <div className="nearby-loading-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="nearby-skeleton-card">
                <div className="nearby-skeleton-photo pulse-animation"></div>
                <div className="nearby-skeleton-body">
                  <div className="nearby-skeleton-line nearby-skeleton-line-long pulse-animation"></div>
                  <div className="nearby-skeleton-line nearby-skeleton-line-medium pulse-animation"></div>
                  <div className="nearby-skeleton-line nearby-skeleton-line-short pulse-animation"></div>
                </div>
              </div>
            ))}
          </div>
          <p className="nearby-loading-text">
            {locationState === 'prompting'
              ? 'Please allow location access to find hospitals near you.'
              : `Searching for ${getLoadingLabel()} near your location.`}
          </p>
        </div>
      )}

      {locationState === 'denied' && (
        <div className="nearby-status-banner nearby-denied-banner">
          <div className="nearby-status-icon">Location</div>
          <div>
            <p className="nearby-status-title">Location Access Denied</p>
            <p className="nearby-status-msg">
              To find hospitals near you, please enable location access in your browser settings and try again.
            </p>
          </div>
          <button onClick={requestLocation} className="nearby-retry-btn">Try Again</button>
        </div>
      )}

      {locationState === 'error' && (
        <div className="nearby-status-banner nearby-error-banner">
          <div className="nearby-status-icon">Alert</div>
          <div>
            <p className="nearby-status-title">Something went wrong</p>
            <p className="nearby-status-msg">{errorMsg}</p>
          </div>
          <button onClick={requestLocation} className="nearby-retry-btn">Retry</button>
        </div>
      )}

      {locationState === 'success' && nearbyDoctors.length === 0 && (
        <div className="nearby-status-banner nearby-empty-banner">
          <div className="nearby-status-icon">Empty</div>
          <div>
            <p className="nearby-status-title">No Hospitals Found Nearby</p>
            <p className="nearby-status-msg">
              We couldn&apos;t find any {getLoadingLabel()} near your location. Try a broader search.
            </p>
          </div>
        </div>
      )}

      {locationState === 'success' && nearbyDoctors.length > 0 && (
        <div className="nearby-results-grid">
          {nearbyDoctors.map((doctor, index) => (
            <div
              key={doctor.placeId || index}
              className="nearby-card"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className="nearby-card-photo-wrap">
                {doctor.photo ? (
                  <img
                    src={getPhotoUrl(doctor.photo)}
                    alt={doctor.name}
                    className="nearby-card-photo"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className="nearby-card-photo-placeholder"
                  style={{ display: doctor.photo ? 'none' : 'flex' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {doctor.openNow !== null && (
                  <span className={`nearby-badge ${doctor.openNow ? 'nearby-badge-open' : 'nearby-badge-closed'}`}>
                    {doctor.openNow ? 'Open Now' : 'Closed'}
                  </span>
                )}

                {doctor.specialtyTag && (
                  <span className="nearby-badge nearby-badge-specialty">
                    {doctor.specialtyTag}
                  </span>
                )}
              </div>

              <div className="nearby-card-body">
                <h3 className="nearby-card-name">{doctor.name}</h3>

                {doctor.rating && (
                  <div className="nearby-card-rating">
                    <div className="nearby-stars-row">
                      {renderStars(doctor.rating)}
                    </div>
                    <span className="nearby-rating-number">{doctor.rating}</span>
                    <span className="nearby-rating-count">({doctor.userRatingsTotal} reviews)</span>
                  </div>
                )}

                <p className="nearby-card-address">
                  <svg className="nearby-addr-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {doctor.address}
                </p>

                {token ? (
                  <>
                    {doctor.phone && (
                      <a href={`tel:${doctor.phone}`} className="nearby-card-contact" onClick={(event) => handleProtectedAction(doctor, event)}>
                        <svg className="nearby-contact-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {doctor.phone}
                      </a>
                    )}

                    {doctor.website && (
                      <a href={doctor.website} target="_blank" rel="noopener noreferrer" className="nearby-card-contact nearby-card-website" onClick={(event) => handleProtectedAction(doctor, event)}>
                        <svg className="nearby-contact-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                        </svg>
                        Visit Website
                      </a>
                    )}

                    {!doctor.phone && !doctor.website && (
                      <p className="nearby-empty-contact">Contact details are not listed for this place yet.</p>
                    )}

                    <div className="nearby-card-actions">
                      <a
                        href={doctor.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nearby-directions-link"
                        onClick={(event) => handleProtectedAction(doctor, event)}
                      >
                        Get Directions
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </>
                ) : (
                  <div className={`nearby-locked-card ${darkMode ? 'nearby-locked-card-dark' : ''}`}>
                    <p className="nearby-locked-title">Login required</p>
                    <p className="nearby-locked-text">Sign in to unlock contact info and directions.</p>
                    <button onClick={handleLoginRedirect} className="nearby-locked-button">
                      Login to continue
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NearbyDoctors
