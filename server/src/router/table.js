const express = require('express');
const { getTables, saveTableReservation, fetchTableAdmin, toggleTableAvailability } = require('../controller/table');

const createTableRouter = (io) => {
  const router = express.Router();

  router.get('/tables', getTables);
  router.post("/tables", ('/tables', (req, res) => saveTableReservation(req, res, io)));
  router.get('/admin/tables', fetchTableAdmin);
  router.put('/tables/:tableId/availability', (req, res) => toggleTableAvailability(req, res, io));

  return router;
};

module.exports = createTableRouter;
