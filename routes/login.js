const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');

// In Sign-up page if we add the use this is the route that executes that function
router.post('/loginUser', loginController.loginUser);

module.exports = router;