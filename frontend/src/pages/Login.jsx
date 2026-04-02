import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate, useLocation } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
const supabaseUrl = 'https://bhhzapwthcuabbsopcpu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoaHphcHd0aGN1YWJic29wY3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDAyODgsImV4cCI6MjA5MDcxNjI4OH0.s_TWSMSP3eMbfV36OlLnJVEyqW3hPbAjpl68Krqq1wE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const Login = () => {
  const { backendUrl, token, setToken, darkMode, setDarkMode } = useContext(AppContext)
  const location = useLocation()
  const [state, setState] = useState(location.state?.mode || 'Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true)
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password });
        if (data.success) {
          if (data.token) {
            localStorage.setItem('token', data.token)
            setToken(data.token)
            toast.success(data.message || "Signup successful!")
            navigate('/')
          } else {
            toast.info(data.message || "Please check your email for a confirmation link.")
            setState('Login')
          }
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success("Logged in successfully")
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
      console.error(error);
    }
    setLoading(false)
  }

  const onGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const { data } = await axios.post(backendUrl + '/api/user/google-login', {
        token: credentialResponse.credential
      });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        toast.success("Logged in with Google successfully");
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Google Login Failed");
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) navigate('/')
  }, [token])

  const isSignUp = state === 'Sign Up'

  return (
    <div style={{ ...styles.page, background: darkMode ? '#020617' : '#eceff1' }}>
      {/* Full-screen background */}
      <div style={{ ...styles.bgBase, background: darkMode ? 'radial-gradient(circle at top, #0f172a 0%, #020617 58%, #01040d 100%)' : '#eceff1' }} />

      {/* Decorative top-right – bleeds to edge */}
      <div style={{ ...styles.decorTopRight, background: darkMode ? '#1f2937' : '#ef9a9a', opacity: darkMode ? 0.95 : 0.9 }} />

      {/* Decorative bottom-left – bleeds to edge */}
      <div style={{ ...styles.decorBottomLeft, background: darkMode ? '#0f766e' : '#FFCA28', opacity: darkMode ? 0.75 : 0.95 }} />

      {/* Back to Home button */}
      <button
        onClick={() => navigate('/')}
        style={styles.backBtn}
      >
        <span style={styles.backArrow}>&#8592;</span> Back to Home
      </button>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          ...styles.backBtn,
          left: 'auto',
          right: 24,
          background: darkMode ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.85)',
          color: darkMode ? '#5eead4' : '#26A69A',
          border: darkMode ? '1.5px solid rgba(45,212,191,0.35)' : '1.5px solid rgba(38,166,154,0.35)',
        }}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      {/* Card */}
      <div style={styles.card}>
        {/* ========== LEFT PANEL (white - Login form) ========== */}
        <div style={{
          ...styles.leftPanel,
          transform: isSignUp ? 'translateX(100%)' : 'translateX(0)',
          transition: 'transform 0.55s cubic-bezier(0.77, 0, 0.175, 1)',
          zIndex: isSignUp ? 1 : 2,
          borderRadius: isSignUp ? '0 20px 20px 0' : '20px 0 0 20px',
          background: darkMode ? '#1a1a1a' : '#fff',
        }}>
          <form onSubmit={onSubmitHandler} style={styles.form}>
            <h2 style={{...styles.formTitle, color: '#26A69A'}}>Sign in to DocSpot</h2>
            <p style={{...styles.orText, color: darkMode ? '#bbb' : '#aaa'}}>or use your email account:</p>

            {/* Removed left panel logo as per user request */}

            <div style={styles.inputWrapper}>
              <svg style={{...styles.inputIcon, stroke: darkMode ? '#666' : '#999'}} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
              </svg>
              <input style={{...styles.input, background: darkMode ? '#2a2a2a' : '#f0f4f4', color: darkMode ? '#e0e0e0' : '#444'}} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div style={styles.inputWrapper}>
              <svg style={{...styles.inputIcon, stroke: darkMode ? '#666' : '#999'}} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input style={{...styles.input, background: darkMode ? '#2a2a2a' : '#f0f4f4', color: darkMode ? '#e0e0e0' : '#444'}} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>


            <button type="submit" style={styles.primaryBtn} disabled={loading}>
              {loading ? 'Signing in...' : 'SIGN IN'}
            </button>

            <div style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={() => {
                  toast.error('Google Login Failed');
                }}
              />
            </div>
          </form>
        </div>

        {/* ========== TEAL SLIDING PANEL ========== */}
        <div style={{
          ...styles.tealPanel,
          left: isSignUp ? '0%' : '50%',
          transition: 'left 0.55s cubic-bezier(0.77, 0, 0.175, 1)',
          borderRadius: isSignUp ? '20px 0 0 20px' : '0 20px 20px 0',
          background: darkMode ? '#0d1f1e' : TEAL_GRADIENT,
        }}>
          {/* Geometric decorative shapes */}
          <div style={styles.geoShape1} />
          <div style={styles.geoShape2} />
          <div style={styles.geoShape3} />
          <div style={styles.geoShape4} />

          <div style={styles.tealContent}>
            {isSignUp ? (
              <>
                <h2 style={styles.tealTitle}>Welcome Back!</h2>
                <p style={styles.tealSubtitle}>To keep connected with us please login with your personal info</p>
                <button onClick={() => setState('Login')} type="button" style={styles.outlineBtn}>SIGN IN</button>
              </>
            ) : (
              <>
                <h2 style={styles.tealTitle}>Hello, Friend!</h2>
                <p style={styles.tealSubtitle}>Enter your personal details and start your journey with us</p>
                <button onClick={() => setState('Sign Up')} type="button" style={styles.outlineBtn}>SIGN UP</button>
              </>
            )}
          </div>
        </div>

        {/* ========== RIGHT PANEL (white - Sign Up form) ========== */}
        <div style={{
          ...styles.signupPanel,
          transform: isSignUp ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.55s cubic-bezier(0.77, 0, 0.175, 1)',
          zIndex: isSignUp ? 2 : 1,
          background: darkMode ? '#1a1a1a' : '#fff',
        }}>
          <form onSubmit={onSubmitHandler} style={styles.form}>
            <h2 style={{ ...styles.formTitle, color: '#26A69A' }}>Create Account</h2>
            <p style={{ ...styles.orText, color: darkMode ? '#bbb' : '#aaa' }}>or use your email for registration:</p>

            <div style={styles.inputWrapper}>
              <svg style={{...styles.inputIcon, stroke: darkMode ? '#666' : '#999'}} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <input style={{...styles.input, background: darkMode ? '#2a2a2a' : '#f0f4f4', color: darkMode ? '#e0e0e0' : '#444'}} type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div style={styles.inputWrapper}>
              <svg style={{...styles.inputIcon, stroke: darkMode ? '#666' : '#999'}} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
              </svg>
              <input style={{...styles.input, background: darkMode ? '#2a2a2a' : '#f0f4f4', color: darkMode ? '#e0e0e0' : '#444'}} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div style={styles.inputWrapper}>
              <svg style={{...styles.inputIcon, stroke: darkMode ? '#666' : '#999'}} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input style={{...styles.input, background: darkMode ? '#2a2a2a' : '#f0f4f4', color: darkMode ? '#e0e0e0' : '#444'}} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <button type="submit" style={{ ...styles.primaryBtn, marginTop: 22 }} disabled={loading}>
              {loading ? 'Processing...' : 'SIGN UP'}
            </button>

            <div style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={() => {
                  toast.error('Google Sign Up Failed');
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const TEAL_GRADIENT = 'linear-gradient(135deg, #4DB6AC 0%, #26A69A 50%, #00897B 100%)'

const styles = {
  page: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Manrope, Inter, sans-serif',
    overflow: 'hidden',
  },
  bgBase: {
    position: 'absolute',
    inset: 0,
    background: '#eceff1',
    zIndex: 0,
  },
  /* Pink/coral bleeds from top-right corner to edge */
  decorTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 220,
    height: 220,
    background: '#ef9a9a',
    borderRadius: '0 0 0 100%',
    opacity: 0.9,
    zIndex: 1,
  },
  /* Yellow circle peeks from bottom-left corner */
  decorBottomLeft: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 220,
    height: 220,
    background: '#FFCA28',
    borderRadius: '50%',
    opacity: 0.95,
    zIndex: 1,
  },
  /* Back to Home button – top-left */
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 24,
    zIndex: 10,
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(8px)',
    border: '1.5px solid rgba(38,166,154,0.35)',
    color: '#26A69A',
    borderRadius: 50,
    padding: '8px 20px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    fontFamily: 'Inter, sans-serif',
    letterSpacing: 0.3,
    transition: 'background 0.2s, box-shadow 0.2s',
  },
  backArrow: {
    fontSize: 16,
    lineHeight: 1,
  },
  card: {
    position: 'relative',
    zIndex: 2,
    width: 820,
    height: 510,
    background: '#fff',
    borderRadius: 20,
    boxShadow: '0 24px 64px rgba(0,106,98,0.15)',
    overflow: 'hidden',
  },
  leftPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '100%',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  signupPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  tealPanel: {
    position: 'absolute',
    top: 0,
    width: '50%',
    height: '100%',
    background: TEAL_GRADIENT,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 3,
  },
  geoShape1: {
    position: 'absolute', top: 24, right: 24, width: 80, height: 80,
    border: '2px solid rgba(255,255,255,0.2)', borderRadius: 4, transform: 'rotate(30deg)',
  },
  geoShape2: {
    position: 'absolute', bottom: 40, left: 16, width: 44, height: 44,
    border: '2px solid rgba(255,255,255,0.18)', borderRadius: 4, transform: 'rotate(15deg)',
  },
  geoShape3: {
    position: 'absolute', top: '62%', right: 18, width: 0, height: 0,
    borderLeft: '18px solid transparent', borderRight: '18px solid transparent',
    borderBottom: '30px solid rgba(255,255,255,0.15)',
  },
  geoShape4: {
    position: 'absolute', top: 18, left: 24, width: 0, height: 0,
    borderLeft: '13px solid transparent', borderRight: '13px solid transparent',
    borderBottom: '22px solid rgba(255,255,255,0.13)',
  },
  tealContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 40px',
    textAlign: 'center',
  },
  tealTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 10,
    fontFamily: 'Manrope, sans-serif',
  },
  tealSubtitle: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 14,
    lineHeight: 1.6,
    marginBottom: 28,
    fontFamily: 'Inter, sans-serif',
  },
  outlineBtn: {
    background: 'transparent',
    border: '2px solid #fff',
    color: '#fff',
    borderRadius: 50,
    padding: '11px 44px',
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 1.5,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '22px 30px 0',
  },
  logoBox: {
    width: 30,
    height: 30,
    border: '2px solid #26A69A',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 15,
    fontWeight: 700,
    color: '#26A69A',
    fontFamily: 'Manrope, sans-serif',
    letterSpacing: 0.5,
  },
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 36px 20px',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: '#26A69A',
    marginBottom: 6,
    fontFamily: 'Manrope, sans-serif',
    letterSpacing: 0.3,
  },
  orText: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 14,
    fontFamily: 'Inter, sans-serif',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: 10,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '11px 14px 11px 38px',
    background: '#f0f4f4',
    border: 'none',
    borderRadius: 6,
    fontSize: 13,
    color: '#444',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box',
  },
  forgotLink: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
    cursor: 'pointer',
    alignSelf: 'center',
    fontFamily: 'Inter, sans-serif',
  },
  primaryBtn: {
    background: TEAL_GRADIENT,
    color: '#fff',
    border: 'none',
    borderRadius: 50,
    padding: '12px 52px',
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 1.5,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    boxShadow: '0 8px 24px rgba(38,166,154,0.35)',
  },
}

export default Login
