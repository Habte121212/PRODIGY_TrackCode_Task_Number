// routes
const express = require('express')
const router = express.Router()
const { authenticate } = require('../middleware/auth')
const authController = require('../controller/authController')

// Public routes
router.post('/register', authController.register)
router.post('/login', authController.login)

// Protected routes
router.post('/logout', authenticate, authController.logout)

module.exports = router
