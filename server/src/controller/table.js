const { mysqlPool } = require("../database/mysql");

/**
 * Fetch all tables from the database.
 * Sends a JSON response containing table data.
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

module.exports = { getTables };
