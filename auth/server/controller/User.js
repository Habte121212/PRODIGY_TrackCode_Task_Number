const Joi = require('joi')
const prisma = require('../prismaClient')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
})

// Register
const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  const { name, email, password } = req.body
  try {
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    })

    res.status(201).json({ message: 'Registration successful' })
  } catch (err) {
    if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
      return res.status(409).json({ error: 'Email already registered.' })
    }
    return res.status(500).json({ error: 'Internal server error.' })
  }
}

// Login
const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'User not found' })

  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword)
    return res.status(401).json({ error: 'Invalid credentials' })

  // Generate Jwt
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  })
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d', 
    },
  )

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, 
  })
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  res.json({ message: 'Login successful' })
}

// Logout
const logout = (req, res) => {
  res.clearCookie('token')
  res.clearCookie('refreshToken')
  res.json({ message: 'Logged out' })
}

module.exports = { register, login, logout }
