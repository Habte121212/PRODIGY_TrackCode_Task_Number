import React from 'react'
import { Link } from 'react-router-dom'
import './register.scss'

const Register = () => {
  const [role, setRole] = React.useState('employee')
  return (
    <div className="register">
      <div className="container">
        <h2>Create Your Account</h2>
        <form className="register__form">
          <fieldset className="register__fieldset">
            <legend className="register__legend">Select Role</legend>
            <div className="role-select">
              <label className="role-label">
                <input
                  type="radio"
                  name="role"
                  value="employee"
                  checked={role === 'employee'}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  aria-label="Employee role"
                />
                <span className="role-label-text">👤 Employee</span>
              </label>
              <label className="role-label">
                <input
                  type="radio"
                  name="role"
                  value="manager"
                  checked={role === 'manager'}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  aria-label="Manager role"
                />
                <span className="role-label-text">🛡️ Manager</span>
              </label>
            </div>
          </fieldset>
          <div className="register__inputs">
            <label className="register__label">
              <input
                type="text"
                placeholder="Full Name"
                required
                className="register__input"
                aria-label="Full Name"
              />
            </label>
            <label className="register__label">
              <input
                type="email"
                placeholder="Email"
                required
                className="register__input"
                aria-label="Email"
              />
            </label>
            <label className="register__label">
              <input
                type="password"
                placeholder="Password"
                required
                className="register__input"
                aria-label="Password"
              />
            </label>
            <label className="register__label">
              <input
                type="password"
                placeholder="Confirm Password"
                required
                className="register__input"
                aria-label="Confirm Password"
              />
            </label>
            {role === 'employee' && (
              <label className="register__label">
                <input
                  type="text"
                  placeholder="Department"
                  required
                  className="register__input"
                  aria-label="Department"
                />
              </label>
            )}
            {role === 'manager' && (
              <label className="register__label">
                <input
                  type="text"
                  placeholder="Admin Code"
                  required
                  className="register__input"
                  aria-label="Admin Code"
                />
              </label>
            )}
          </div>
          <div className="register__actions">
            <button type="submit" className="register-btn">
              Sign Up
            </button>
            <p className="register__login-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
