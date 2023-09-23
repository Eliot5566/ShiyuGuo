const express = require('express');
const router = express.Router();
const resetPWDController = require('../controllers/resetPWDController');

router.post('/', resetPWDController.handleResetPWD);

module.exports = router;