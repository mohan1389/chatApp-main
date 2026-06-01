const express = require('express');
const { insertMsg, fetchChats } = require('../controllers/roomsController');
const { checkUser } = require('../middleware/auth.middleware');
const roomManagerRouter = express.Router();

roomManagerRouter.post('/transmitMessage', insertMsg);
roomManagerRouter.get('/fetchmessages', checkUser, fetchChats);

module.exports = roomManagerRouter;