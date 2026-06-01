const express = require('express');
const {signupUser, fetchUser, signinUser} = require('../controllers/authControllers'); 
const { checkUser } = require('../middleware/auth.middleware');

const authRouter = express.Router();

authRouter.get('/fetchUser', checkUser, fetchUser);
authRouter.post('/register', signupUser);
authRouter.post('/access', signinUser);

module.exports = authRouter