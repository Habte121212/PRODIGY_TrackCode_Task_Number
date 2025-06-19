import './register.scss'
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Register = () => {
  const buttonRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate();

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  const handleRipple = (e) => {
    if (loading || !buttonRef.current) return

    const button = buttonRef.current
    const circle = document.createElement('span')
    const diameter = Math.max(button.clientWidth, button.clientHeight)
    const radius = diameter * 0.3

    circle.style.width = circle.style.height = `${radius * 2}px`
    circle.style.left = `${e.nativeEvent.offsetX - radius}px`
    circle.style.top = `${e.nativeEvent.offsetY - radius}px`
    circle.className = 'ripple business-ripple'

    const existingRipple = button.querySelector('.ripple')
    if (existingRipple) existingRipple.remove()

    button.appendChild(circle)

    setTimeout(() => {
      circle.remove()
    }, 1200)
  }

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      toast.error('All fields are required')
      return false
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return false
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8500/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Registration successful!')
        resetForm()
        navigate('/login')

      } else {
        toast.error(data.error || 'Registration failed')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register">
      <div className="registerContainer">
        <h1>Register</h1>
        <form
          className="registerForm"
          onSubmit={(e) => {
            handleRipple(e)
            handleSubmit(e)
          }}
        >
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  )
}

export default Register
