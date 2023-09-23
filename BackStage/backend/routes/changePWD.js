const express = require('express');
const router = express.Router();
const changePWDController = require('../controllers/changePWDController');

router.post('/', changePWDController.handleChangePWD);

module.exports = router;