const express = require('express');
const { sendRequest, fetchSentRequests, handleRequest } = require('../controllers/friendReqController');

const firendReqRouter = express.Router();

firendReqRouter.post('/sendRequest', sendRequest);
firendReqRouter.get('/fetchRequests', fetchSentRequests);
firendReqRouter.post('/awknowledgeRequest', handleRequest);

module.exports = firendReqRouter;