const express = require("express");
const { addOrder, getAllOrders, getCustomerOrders, updateOrder } = require("../controller/order");

const orderRouter = (io) => {
  const router = express.Router();

  router.post("/orders", addOrder);
  router.get("/admin/orders", getAllOrders);
  router.get("/customer/orders/:user_id", getCustomerOrders);
  router.post("/update-status", (req, res) => updateOrder(req, res, io)); // Pass io to the controller

  return router; // Return the router instance
};

module.exports = orderRouter;
