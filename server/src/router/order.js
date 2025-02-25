const express = require('express');
const { addOrder, getAllOrders, getCustomerOrders } = require('../controller/order');
const router = express.Router();


router.post('/orders',addOrder)
router.get("/admin/orders", getAllOrders);
router.get("/customer/orders/:user_id", getCustomerOrders);

module.exports = router