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
        user_id || null, // Pass NULL if user_id is empty
        order_id || null, // Pass NULL if order_id is empty
        reserve_time || null, // Ensure valid time string or NULL
        available,
        reserve_date || null, // Ensure valid date string or NULL
        no_of_people || null, // Ensure valid integer or NULL
      ]);

      res.status(201).json({ message: 'Table reservation added successfully.', id: result.insertId });
    }
  } catch (error) {
    console.error('Error saving table reservation:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};



const fetchTableAdmin = async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(`
      SELECT 
        t.id, 
        t.table_number, 
        t.seats, 
        t.available, 
        u.username AS customer_name,  -- Get the username from the Users table
        t.reserve_time, 
        t.reserve_date, 
        t.no_of_people
      FROM Tables t
      LEFT JOIN Users u ON t.user_id = u.user_id;  -- Join Tables with Users based on user_id
    `);
    
    console.log(rows); // This should now log the data correctly
    res.json(rows); // Send the rows as JSON response
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'Failed to fetch tables data' });
  }
};


module.exports = { getTables, saveTableReservation, fetchTableAdmin };
