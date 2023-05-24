const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');
const authController = require('../middleware/auth');

// In Sign-up page if we add the use this is the route that executes that function
router.post('/addChat', authController.authenticate, chatController.addChat);
router.get('/getchat/:messageId', authController.authenticate, chatController.getChat);

module.exports = router;