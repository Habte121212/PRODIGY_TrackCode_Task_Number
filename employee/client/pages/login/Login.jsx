import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './login.scss'

const Login = () => {
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const handleResetSubmit = (e) => {
    e.preventDefault()

    setResetSent(true)
    setTimeout(() => {
      setShowReset(false)
      setResetSent(false)
      setResetEmail('')
    }, 2500)
  }

  return (
    <div className="login">
      <div className="containearLogin">
        <h2 className="login__title">Sign In to Your Account</h2>
        <form className="loginForm">
          <label className="login__label">
            Email
            <input
              type="email"
              placeholder="Email"
              required
              aria-label="Email"
              className="login__input"
            />
          </label>
          <label className="login__label">
            Password
            <input
              type="password"
              placeholder="Password"
              required
              aria-label="Password"
              className="login__input"
            />
          </label>
          <div className="forget-password">
            <button
              type="button"
              className="link-btn"
              onClick={() => setShowReset(true)}
            >
              Forget Password?
            </button>
          </div>
          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>
        <p className="register__login-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
      {showReset && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={() => setShowReset(false)}>
              &times;
            </button>
            <h3>Reset Password</h3>
            {resetSent ? (
              <div className="modal-message">
                If this email exists, a reset link has been sent.
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="modal-form">
                <label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="login__input"
                    placeholder="Email"
                  />
                </label>
                <button
                  type="submit"
                  className="login-btn"
                  style={{ marginTop: '10px' }}
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Login

