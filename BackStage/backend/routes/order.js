const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.handleAllOrder);
router.post('/:id', orderController.handleOrderByID);

module.exports = router;