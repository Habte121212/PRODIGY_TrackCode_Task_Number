const express = require('express')
const router = express.Router()
const { authenticate } = require('../middleware/auth')
const { requireEmployee } = require('../middleware/role')
const employeeController = require('../controller/employeeController')

// All routes require authentication and employee role
router.use(authenticate, requireEmployee)

router.get('/employees', employeeController.getEmployees)

module.exports = router
