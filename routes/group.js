const express = require('express');
const router = express.Router();

// IMPORTING THE CONTROLLERS
const groupController = require('../controllers/groups');
const authController = require('../middleware/auth');

// CREATING A NEW GROUP
router.post('/addGroup', authController.authenticate, groupController.addGroups);
router.post('/addUserToGroup', authController.authenticate, groupController.addUserToGroup);
router.get('/getGroups', authController.authenticate, groupController.getGroups);

module.exports = router;