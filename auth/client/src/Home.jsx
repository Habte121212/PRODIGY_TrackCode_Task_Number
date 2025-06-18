import React from 'react'

const Home = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f2f4f7 100%)',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', color: '#3730a3', marginBottom: 16 }}>
        Welcome to the Home Page
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#6366f1' }}>You are logged in!</p>
    </div>
  )
}

export default Home
