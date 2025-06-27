const prisma = require('../prismaClient')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const tokenUtils = require('../utils/token')

// Register a new user
const register = async (req, res) => {
  try {
    // Accept role in request
    const { role } = req.body
    if (!role || !['admin', 'employee'].includes(role)) {
      return res
        .status(400)
        .json({ error: 'Role must be either admin or employee' })
    }

    // Dynamic validation based on role
    let schema
    if (role === 'admin') {
      schema = Joi.object({
        email: Joi.string().email().trim().required(),
        name: Joi.string().min(3).max(100).trim().required(),
        password: Joi.string().min(6).trim().required(),
        Admin_code: Joi.string().min(4).max(100).trim().required(),
        role: Joi.string().valid('admin').required(),
      })
    } else {
      schema = Joi.object({
        email: Joi.string().email().trim().required(),
        name: Joi.string().min(3).max(100).trim().required(),
        password: Joi.string().min(6).trim().required(),
        department: Joi.string().min(3).max(100).trim().required(),
        role: Joi.string().valid('employee').required(),
      })
    }
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { email, name, password, department, Admin_code } = req.body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    // Admin logic: check Admin_code
    if (role === 'admin') {
      const allowedAdminCodes = ['121221', '232312', 'dawit123', 'bro123']
      if (!allowedAdminCodes.includes(Admin_code)) {
        return res
          .status(400)
          .json({ error: 'Invalid Admin_code. Not authorized.' })
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        department: department || null,
        Admin_code: Admin_code || null,
        role,
      },

    })


    // Generate tokens
    const accessToken = tokenUtils.generateAccessToken(newUser.id)
    const refreshToken = tokenUtils.generateRefreshToken()
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Store refresh token in DB
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: newUser.id,
        expiresAt: refreshTokenExpiry,
      },
    })

    // Set cookies
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 min
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    // Return user info (excluding password)
    const { password: _, ...userWithoutPassword } = newUser
    res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword })
  } catch (error) {
    console.error('Error during registration:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Login user
const login = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().trim().required(),
      password: Joi.string().min(6).trim().required(),
    })
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    // Generate tokens
    const accessToken = tokenUtils.generateAccessToken(user.id)
    const refreshToken = tokenUtils.generateRefreshToken()
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    // Store refresh token in DB (delete old tokens for rotation)
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } })
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshTokenExpiry,
      },
    })

    // Set cookies
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    const { password: _, ...userWithoutPassword } = user
    res.status(200).json({message: 'login sucessful',  user: userWithoutPassword })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Refresh token endpoint
const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken)
      return res.status(401).json({ error: 'No refresh token' })
    const dbToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    })
    if (!dbToken || dbToken.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Refresh token expired or invalid' })
    }
    const user = await prisma.user.findUnique({ where: { id: dbToken.userId } })
    if (!user) return res.status(401).json({ error: 'User not found' })
    // Rotate refresh token
    await prisma.refreshToken.delete({ where: { token: refreshToken } })
    const newRefreshToken = tokenUtils.generateRefreshToken()
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: refreshTokenExpiry,
      },
    })
    // Issue new access token
    const accessToken = tokenUtils.generateAccessToken(user.id)
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    })
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    const { password: _, ...userWithoutPassword } = user
    res.status(200).json({message: 'Acess token',  user: userWithoutPassword })
  } catch (error) {
    console.error('Error during token refresh:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Logout endpoint
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
    }
    res.clearCookie('token')
    res.clearCookie('refreshToken')
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Error during logout:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = {
  register,
  login,
  refresh,
  logout,
}
