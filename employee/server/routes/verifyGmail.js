// Gmail verification routes
const express = require('express')
const router = express.Router()
const controller = require('../controller/gmailVerify');

router.get('/verify-email', controller.verifyEmail)

module.exports = router;