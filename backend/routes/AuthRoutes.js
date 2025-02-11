const express = require('express');
const router = express.Router();
const { signIn, signUp } = require('../controllers/AuthController');

// Route Login
router.post('/signin', signIn);
router.post('/createaccount', signUp);

module.exports = router;