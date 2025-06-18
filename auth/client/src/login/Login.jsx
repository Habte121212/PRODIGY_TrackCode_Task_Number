import './login.scss'
import React, { useRef, useState } from 'react'

const Login = () => {
  const buttonRef = useRef(null)
  const [loading, setLoading] = useState(false)

  // Business-class ripple effect handler with loading
  const handleRipple = (e) => {
    if (loading) return
    setLoading(true)
    const button = buttonRef.current
    const circle = document.createElement('span')
    const diameter = Math.max(button.clientWidth, button.clientHeight)
    const radius = diameter / 2
    const rect = button.getBoundingClientRect()
    circle.style.width = circle.style.height = `${diameter * 0.6}px`
    circle.style.left = `${e.clientX - rect.left - diameter * 0.3}px`
    circle.style.top = `${e.clientY - rect.top - diameter * 0.3}px`
    circle.className = 'ripple business-ripple'
    // Remove old ripple if exists
    const oldRipple = button.getElementsByClassName('ripple')[0]
    if (oldRipple) oldRipple.remove()
    button.appendChild(circle)
    setTimeout(() => {
      circle.remove()
      setLoading(false)
    }, 1200)
  }

  // Animate login container on mount
  React.useEffect(() => {
    const container = document.querySelector('.loginContainer')
    if (container) {
      container.classList.add('login-animate-in')
    }
  }, [])

  return (
    <div className="login">
      <div className="loginContainer">
        <h1>Login</h1>
        <div className="loginForm">
          <input type="email" placeholder="Email" disabled={loading} />
          <input type="password" placeholder="Password" disabled={loading} />
          <button
            type="button"
            ref={buttonRef}
            onClick={handleRipple}
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? <span className="loader-circle" /> : 'Login'}
          </button>
        </div>
        <p>
          Don't have an account?
          <a href="/register"> Register</a>
        </p>
      </div>
    </div>
  )
}

export default Login
