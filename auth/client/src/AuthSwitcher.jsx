import React from 'react'
import { useAuth } from './context/AuthContext'

const AuthSwitcher = ({ page, setPage }) => {
  const { user } = useAuth()
  if (user) return null
  return (
    <div style={{ textAlign: 'center', margin: '16px 0' }}>
      {page === 'login' ? (
        <>
          Don't have an account?{' '}
          <button
            style={{
              color: '#2563eb',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
            onClick={() => setPage('register')}
          >
            Register
          </button>
        </>
      ) : (
        <>
          Already have an account?{' '}
          <button
            style={{
              color: '#2563eb',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
            onClick={() => setPage('login')}
          >
            Login
          </button>
        </>
      )}
    </div>
  )
}

export default AuthSwitcher
