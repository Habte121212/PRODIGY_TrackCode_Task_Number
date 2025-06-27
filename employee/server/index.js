const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { csrfProtection } = require('../server/middleware/auth')
const tokenUtils = require('./utils/token')
const rateLimit = require('express-rate-limit')
const xss = require('xss-clean')
const helmet = require('helmet')

dotenv.config()

// initializations
const app = express()
app.use(helmet())
app.use(xss())
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// Rate limiter for password reset requests
const resetLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3,
  message:
    'Too many password reset requests from this IP, please try again in 24 hours.',
})

app.use('/server/auth/password/request', resetLimiter)

app.use(csrfProtection)

// csurf protection routes
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})

// auth routes
const authRoutes = require('./routes/authRoutes')
app.use('/server/auth', authRoutes)

// Gmail email verification route
const gmailVerifyRoutes = require('./routes/verifyGmail')
app.use('/server/auth', gmailVerifyRoutes)

// Password reset routes
const restPasswordRoutes = require('./routes/resetPassword')
app.use('/server/auth', restPasswordRoutes)

// manager routes
const managerRoutes = require('./routes/manager')
app.use('/server/manager', managerRoutes)

// employee routes
const employeeRoutes = require('./routes/employee')
app.use('/server/employee', employeeRoutes)

//port
const port = process.env.PORT || 8500
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
