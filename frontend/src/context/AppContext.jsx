import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vpwpqaqcczqawbgpvzxb.supabase.co'
const supabaseAnonKey = 'sb_publishable_6sP4ChuuIoQLGzWkEsyLtQ_KDgiCPyQ'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [userData, setUserData] = useState(false)
    const [userLocation, setUserLocation] = useState(null)
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true')

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })
            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            if (error?.response?.status !== 500) {
                toast.error(error.message)
            }
        }
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
        } catch (error) {
            console.log('IP geolocation fallback failed:', error.message)
        }

        return null
    }

    const requestLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                },
                async (error) => {
                    console.log('Browser geolocation failed, trying IP fallback:', error.message)
                    const fallbackLocation = await fetchApproxLocation()
                    if (fallbackLocation) {
                        setUserLocation(fallbackLocation)
                    }
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
            )
        } else {
            const fallbackLocation = await fetchApproxLocation()
            if (fallbackLocation) {
                setUserLocation(fallbackLocation)
            } else {
                console.log('Geolocation is not supported by this browser.')
            }
        }
    }

    useEffect(() => {
        requestLocation()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    }, [token])

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode)
    }, [darkMode])

    useEffect(() => {
        const backgroundColor = darkMode ? '#020617' : '#ffffff'
        document.documentElement.style.backgroundColor = backgroundColor
        document.body.style.backgroundColor = backgroundColor
        document.body.style.colorScheme = darkMode ? 'dark' : 'light'
    }, [darkMode])

    const value = {
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData,
        userLocation,
        darkMode, setDarkMode
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
