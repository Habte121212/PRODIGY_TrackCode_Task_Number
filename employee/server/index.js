const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { csrfProtection } = require('../server/middleware/auth')
const tokenUtils = require('./utils/token')

dotenv.config()

// initializations
const app = express()
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

app.use(csrfProtection)

//Route to get CSRF token
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})

// Import and use auth routes
const authRoutes = require('./routes/authRoutes')
app.use('/server/auth', authRoutes)

//port
const port = process.env.PORT || 8500
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
