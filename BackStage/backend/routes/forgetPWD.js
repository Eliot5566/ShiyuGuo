const express = require('express');
const router = express.Router();
const forgetPWDController = require('../controllers/forgetPWDController');

router.post('/', forgetPWDController.handleForgetPWD);

module.exports = router;