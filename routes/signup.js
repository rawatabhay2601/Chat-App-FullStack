const express = require('express');
const router = express.Router();
const userController = require('../controllers/signup');

// In Sign-up page if we add the use this is the route that executes that function
router.post('/addUser', userController.addUser);

module.exports = router;