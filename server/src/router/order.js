const express = require("express");
const { addOrder, getAllOrders, getCustomerOrders, updateOrder, deleteCompletedOrders } = require("../controller/order");

const orderRouter = (io) => {
  const router = express.Router();

  router.post("/orders", (req, res) => addOrder(req, res, io));
  router.get("/admin/orders", getAllOrders);
  router.get("/customer/orders/:user_id", getCustomerOrders);
  router.post("/update-status", (req, res) => updateOrder(req, res, io)); // Pass io to the controller
  router.delete("/deleteorders",(req,res) => deleteCompletedOrders(req,res,io)); // Route to delete completed orders

  return router; // Return the router instance
};

module.exports = orderRouter;
