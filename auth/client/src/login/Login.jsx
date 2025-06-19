import './login.scss'
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Login = () => {
  const buttonRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();

  // Business-class ripple effect handler with loading
  const handleRipple = (e) => {
    if (loading) return
    const button = buttonRef.current
    const circle = document.createElement('span')
    const diameter = Math.max(button.clientWidth, button.clientHeight)
    circle.style.width = circle.style.height = `${diameter * 0.6}px`
    circle.style.left = `${e.nativeEvent.offsetX - diameter * 0.3}px`
    circle.style.top = `${e.nativeEvent.offsetY - diameter * 0.3}px`
    circle.className = 'ripple business-ripple'
    // Remove old ripple if exists
    const oldRipple = button.getElementsByClassName('ripple')[0]
    if (oldRipple) oldRipple.remove()
    button.appendChild(circle)
    setTimeout(() => {
      circle.remove()
    }, 1200)
  }

  // Animate login container on mount
  React.useEffect(() => {
    const container = document.querySelector('.loginContainer')
    if (container) {
      container.classList.add('login-animate-in')
    }
  }, [])

  const validateForm = () => {
    if (!email || !password) {
      toast.error('Email and password are required')
      return false
    }
    return true
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8500/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(data.message || 'Login successful!')
        setEmail('')
        setPassword('')
        navigate('/')
      } else {
        toast.error(data.error || 'Login failed')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <div className="loginContainer">
        <h1>Login</h1>
        <form
          className="loginForm"
          onSubmit={(e) => {
            handleRipple(e)
            handleLogin(e)
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            ref={buttonRef}
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? <span className="loader-circle" /> : 'Login'}
          </button>
        </form>
        <p>
          Don't have an account?
          <a href="/register"> Register</a>
        </p>
      </div>
    </div>
  )
}

export default Login
