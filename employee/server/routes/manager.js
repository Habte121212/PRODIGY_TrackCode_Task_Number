const express = require('express')
const router = express.Router()
const { authenticate } = require('../middleware/auth')
const { requireManager } = require('../middleware/role')
const managerController = require('../controller/managerController')

// All routes require authentication and manager role
router.use(authenticate, requireManager)

router.get('/employees', managerController.getEmployees)
router.post('/employees', managerController.addEmployee)
router.put('/employees/:id', managerController.editEmployee)
router.delete('/employees/:id', managerController.deleteEmployee)

module.exports = router
