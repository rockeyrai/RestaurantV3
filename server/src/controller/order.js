const { mysqlPool } = require("../database/mysql");
const { OrderSchema } = require("../model/order");


const addOrder = async (req, res) => {
  const { user_id, table_id, items, total_cost } = req.body;

  if (!user_id || !items || !total_cost) {
    return res.status(400).json({ error: 'user_id, items, and total_cost are required' });
  }

  try {
    // Check if user exists in MySQL
    const [userResult] = await mysqlPool.query('SELECT * FROM Users WHERE user_id = ?', [user_id]);
    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if table exists in MySQL (if provided)
    if (table_id) {
      const [tableResult] = await mysqlPool.query('SELECT * FROM Tables WHERE id = ?', [table_id]);
      if (tableResult.length === 0) {
        return res.status(404).json({ error: 'Table not found' });
      }

      // Ensure the table is available
      if (!tableResult[0].available) {
        return res.status(400).json({ error: 'Table is not available' });
      }
    }

    // Check if menu items exist and calculate cost
    let calculatedCost = 0;
    for (const item of items) {
      const [menuResult] = await mysqlPool.query('SELECT * FROM Menu WHERE menu_item_id = ?', [item.menu_item_id]);
      if (menuResult.length === 0) {
        return res.status(404).json({ error: `Menu item with ID ${item.menu_item_id} not found` });
      }

      calculatedCost += menuResult[0].price * item.quantity;
    }

    // Validate cost matches total_cost
    if (calculatedCost !== total_cost) {
      return res.status(400).json({ error: 'Total cost does not match calculated cost' });
    }

    // Create the order in MongoDB
    const newOrder = new OrderSchema({
      user_id,
      table_id,
      items,
      total_cost,
      status: 'in_progress', // Default status
    });
    const savedOrder = await newOrder.save();

    // Update table status to unavailable in MySQL
    if (table_id) {
      await mysqlPool.query('UPDATE Tables SET available = FALSE, order_id = ? WHERE id = ?', [savedOrder._id, table_id]);
    }

    res.status(201).json({ message: 'Order added successfully', order: savedOrder });
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {addOrder}