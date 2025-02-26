const express = require('express');
const { getTables, saveTableReservation, fetchTableAdmin, toggleTableAvailability, createTable } = require('../controller/table');

const createTableRouter = (io) => {
  const router = express.Router();

  router.get('/tables', getTables);
  router.post('/createtable', createTable);
  router.post("/tables", ('/tables', (req, res) => saveTableReservation(req, res, io)));
  router.get('/admin/tables', fetchTableAdmin);
  router.put('/tables/:tableId/availability', (req, res) => toggleTableAvailability(req, res, io));


  return router;
};

module.exports = createTableRouter;
