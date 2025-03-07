const { mysqlPool } = require("../database/mysql");
const Order = require("../model/order"); // Use the correct model name
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
        available, 
        reserve_time,
        no_of_people
    FROM Tables
`;

    // Execute query using the MySQL pool
    const [rows] = await mysqlPool.query(query);

    // Return fetched rows as JSON
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching tables data:", error);

    // Respond with a generic error message
    res.status(500).json({ message: "Error fetching tables data" });
  }
};

// Pass io instance to this function if not globally accessible
const saveTableReservation = async (req, res, io) => {
  const {
    table_id,
    user_id,
    order_id = null,
    reserve_time,
    available = true,
    reserve_date,
    no_of_people,
  } = req.body;

  try {
    const query = `
      UPDATE Tables
      SET 
        user_id = ?, 
        order_id = ?, 
        reserve_time = ?, 
        available = ?, 
        reserve_date = ?, 
        no_of_people = ?
      WHERE id = ?;
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
      // Fetch the updated table data after the update
      const [updatedTable] = await mysqlPool.query(`
        SELECT * FROM Tables WHERE id = ?;
      `, [table_id]);

      // Emit the updated reservation data
      io.emit("tableUpdated", {
        table_id,
        user_id,
        order_id,
        reserve_time,
        available,
        reserve_date,
        no_of_people,
      });

      res.status(200).json(updatedTable[0]); // Send the updated table data
    } else {
      res.status(404).json({ message: "Table not found." });
    }
  } catch (error) {
    console.error("Error saving table reservation:", error);
    res.status(500).json({ message: "Internal server error." });
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
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Failed to fetch tables data" });
  }
};

const toggleTableAvailability = async (req, res, io) => {
  const { tableId } = req.params;
  const connection = await mysqlPool.getConnection(); // Get a connection from the pool
  console.log(`tabled id ${tableId}`)
  try {
    // Start the transaction
    await connection.beginTransaction();

    // Get current table details to check the reservation and order details
    const [currentTable] = await connection.query(
      `SELECT * FROM Tables WHERE id = ?`,
      [tableId]
    );

    if (currentTable.length === 0) {
      return res.status(404).json({ message: "Table not found." });
    }

    const table = currentTable[0];

    // Update the availability of the table
    const updateQuery = `
      UPDATE Tables
      SET available = NOT available
      WHERE id = ?
    `;
    const [updateResult] = await connection.query(updateQuery, [tableId]);

    if (updateResult.affectedRows > 0) {
      // If table is reserved, delete the reservation and related order
      if (table.user_id) {
        const { order_id, user_id } = table; // Assuming the table has order_id and user_id fields

        // Delete reservation data (user_id, reserve_time, reserve_data, no_of_people)
        const deleteReservationQuery = `
          UPDATE Tables
          SET user_id = NULL, reserve_time = NULL, reserve_date = NULL, no_of_people = NULL
          WHERE id = ?
        `;
        await connection.query(deleteReservationQuery, [tableId]);
console.log(`order id ${order_id}`)
        // If there's an order, delete the order related to the table
        if (order_id) {
          const result = await Order.deleteOne({ _id: order_id });
          if (result.deletedCount === 1) {
            console.log("Successfully deleted the order.");
          } else {
            console.log("No order found with the given ID.");
          }
        }
      }

      // Get the updated table data after update
      const [updatedTable] = await connection.query(
        `SELECT * FROM Tables WHERE id = ?`,
        [tableId]
      );

      // Commit the transaction if everything is successful
      await connection.commit();

      // Emit the updated table to all clients
      io.emit("tableUpdated", updatedTable[0]);

      res.status(200).json(updatedTable[0]);
    } else {
      // If no rows were affected, return an error
      await connection.rollback();
      res.status(404).json({ message: "Table not found or update failed." });
    }
  } catch (error) {
    console.error("Error toggling table availability:", error);
    await connection.rollback(); // Ensure rollback in case of error
    res.status(500).json({ message: "Internal server error." });
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
};

const createTable = async (req, res) => {
  try {
    // Destructure values from request body
    const { table_number, seats, available } = req.body;

    // Ensure all required values are provided
    if (!table_number || !seats || available === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Prepare the SQL query
    const query = `
      INSERT INTO Tables (table_number, seats, available)
      VALUES (?, ?, ?)
    `;
    const values = [table_number, seats, available];

    // Execute the query using async/await
    const [results] = await mysqlPool.query(query, values);

    // Respond with success message and table data
    res.status(201).json({
      message: 'Table added successfully',
      table: {
        table_number,
        seats,
        available,
      },
    });
  } catch (err) {
    console.error('Error adding table:', err);
    return res.status(500).json({ message: 'Error adding table', error: err.message });
  }
};


module.exports = {
  getTables,
  saveTableReservation,
  fetchTableAdmin,
  toggleTableAvailability,
  createTable
};
