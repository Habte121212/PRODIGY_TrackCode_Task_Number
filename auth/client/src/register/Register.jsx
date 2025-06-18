import './register.scss'
import React, { useRef, useState } from 'react'

const Register = () => {
  const buttonRef = useRef(null)
  const [loading, setLoading] = useState(false)

  // Business-class ripple effect handler with loading
  const handleRipple = (e) => {
    if (loading) return
    setLoading(true)
    const button = buttonRef.current
    const circle = document.createElement('span')
    const diameter = Math.max(button.clientWidth, button.clientHeight)
    circle.style.width = circle.style.height = `${diameter * 0.6}px`
    circle.style.left = `${e.nativeEvent.offsetX - diameter * 0.3}px`
    circle.style.top = `${e.nativeEvent.offsetY - diameter * 0.3}px`
    circle.className = 'ripple business-ripple'
    const oldRipple = button.getElementsByClassName('ripple')[0]
    if (oldRipple) oldRipple.remove()
    button.appendChild(circle)
    setTimeout(() => {
      circle.remove()
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="register">
      <div className="registerContainer">
        <h1>Register</h1>
        <form
          className="registerForm"
          onSubmit={(e) => {
            e.preventDefault()
            handleRipple(e)
          }}
        >
          <input type="text" placeholder="Name" disabled={loading} />
          <input type="email" placeholder="Email" disabled={loading} />
          <input type="password" placeholder="Password" disabled={loading} />
          <input
            type="password"
            placeholder="Confirm Password"
            disabled={loading}
          />
          <button
            type="submit"
            ref={buttonRef}
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? <span className="loader-circle" /> : 'Register'}
          </button>
        </form>
        <p>
          Already Have an Account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  )
}

export default Register
