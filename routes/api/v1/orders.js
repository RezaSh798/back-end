const express = require('express');
const router = express.Router();
const OrderController = require('../../../controllers/OrderController');

router.route('/')
    .get(OrderController.getOrders)
    .post(OrderController.newOrder);

router.route('/:id')
    .get(OrderController.getOrder)
    .put(OrderController.updateOrder)
    .delete(OrderController.deleteOrder);

module.exports = router;