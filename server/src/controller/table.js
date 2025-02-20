const { mysqlPool } = require("../database/mysql");

/**
 * Fetch all tables from the database.
 */
const getTables = async (req, res) => {
  try {
    // SQL Query to fetch table data
    const query = `
        SELECT 
            id, 
            table_number, 
            seats, 
            available 
        FROM Tables
    `;

    // Execute query using the MySQL pool
    const [rows] = await mysqlPool.query(query);

    // Return fetched rows as JSON
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching tables data:", error);

    // Respond with a generic error message
    res.status(500).json({ message: 'Error fetching tables data' });
  }
};


const saveTableReservation = async (req, res) => {
  const { 
    table_id, 
    user_id, 
    order_id = null, 
    reserve_time, 
    available = true, 
    reserve_date, 
    no_of_people 
  } = req.body;

  try {
    // If `table_id` is provided, update the record. Otherwise, insert a new one.
    if (table_id) {
      const query = `
        UPDATE Tables
        SET 
          user_id = ?, 
          order_id = ?, 
          reserve_time = ?, 
          available = ?, 
          reserve_date = ?, 
          no_of_people = ?
        WHERE id = ?
      `;
      const [result] = await mysqlPool.query(query, [
        user_id,
        order_id,
        reserve_time,
        available,
        reserve_date,
        no_of_people,
        table_id,
      ]);

      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Table reservation updated successfully.' });
      } else {
        res.status(404).json({ message: 'Table not found.' });
      }
    } else {
      const query = `
        INSERT INTO Tables 
        (user_id, order_id, reserve_time, available, reserve_date, no_of_people)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const [result] = await mysqlPool.query(query, [
        user_id,
        order_id,
        reserve_time,
        available,
        reserve_date,
        no_of_people,
      ]);

      res.status(201).json({ message: 'Table reservation added successfully.', id: result.insertId });
    }
  } catch (error) {
    console.error('Error saving table reservation:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


module.exports = { getTables, saveTableReservation };
