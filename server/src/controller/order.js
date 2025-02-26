const { mysqlPool } = require("../database/mysql");
const Order = require("../model/order"); // Use the correct model name

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

    // Check if table exists and is reserved by the same user
    if (table_id) {
      const [tableResult] = await mysqlPool.query('SELECT * FROM Tables WHERE id = ?', [table_id]);
      if (tableResult.length === 0) {
        return res.status(404).json({ error: 'Table not found' });
      }

      const table = tableResult[0];
      if (!table.user_id || table.user_id !== user_id) {
        return res.status(403).json({ error: 'Table is not reserved by this user' });
      }
    }

    // Calculate total cost using final_price
    let calculatedCost = 0;
    for (const item of items) {
      const query = `
        SELECT 
          m.menu_item_id,
          m.name,
          ROUND(
            CASE 
              WHEN o.offer_type = 'percentage' THEN 
                  m.price * (1 - IFNULL(o.discount_percentage, 0) / 100)
              WHEN o.offer_type = 'fixed_price' THEN 
                  GREATEST(0, m.price - IFNULL(o.discount_percentage, 0))
              ELSE 
                  m.price
            END,
            2
          ) AS final_price
        FROM Menu m
        LEFT JOIN Offers o 
          ON m.menu_item_id = o.menu_item_id
          AND NOW() BETWEEN o.start_date AND o.end_date
        WHERE m.menu_item_id = ?;
      `;

      const [menuResult] = await mysqlPool.query(query, [item.menu_item_id]);
      if (menuResult.length === 0) {
        return res.status(404).json({ error: `Menu item with ID ${item.menu_item_id} not found` });
      }

      const finalPrice = menuResult[0].final_price;
      calculatedCost += finalPrice * item.quantity;
    }

    // Validate cost matches total_cost
    if (calculatedCost !== total_cost) {
      return res.status(400).json({ error: 'Total cost does not match calculated cost' });
    }

    // Create the order in MongoDB
    const newOrder = new Order({
      user_id,
      table_id,
      items,
      total_cost: calculatedCost, // Use calculated cost here
      status: 'in_progress', // Default status
    });
    const savedOrder = await newOrder.save();

    // Update table's `order_id` in MySQL
    if (table_id) {
      await mysqlPool.query(
        'UPDATE Tables SET available = FALSE, order_id = ? WHERE id = ?',
        [savedOrder._id.toString(), table_id] // Convert _id to string
      );
    }

    res.status(201).json({ message: 'Order added successfully', order: savedOrder });
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// API for Admin to Get All Orders in the Desired Format
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from MongoDB

    // Transform the orders data
    const transformedOrders = await Promise.all(
      orders.map(async (order, index) => {
        const transformedItems = await Promise.all(
          order.items.map(async (item) => {
            // Fetch item details (name, price) from the Menu table in MySQL
            const [menuResult] = await mysqlPool.query(
              "SELECT name, price FROM Menu WHERE menu_item_id = ?",
              [item.menu_item_id]
            );

            if (menuResult.length === 0) {
              return { name: "Unknown Item", quantity: item.quantity, price: 0 };
            }

            return {
              name: menuResult[0].name,
              quantity: item.quantity,
              order_id: order._id, // Use `order._id` here
              price: parseFloat(menuResult[0].price) * item.quantity,
            };
          })
        );

        return {
          id: index + 1, // Start from 1 and increment
          order_id: order._id, // Use `order._id` for unique identifier
          table: order.table_id,
          items: transformedItems,
          total: order.total_cost,
          status: order.status,
          timestamp: new Date(order.created_at)
            .toISOString()
            .slice(0, 19)
            .replace("T", " "), // Format timestamp
        };
      })
    );

    res.status(200).json({ success: true, orders: transformedOrders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// API for Customers to Get Their Orders
const getCustomerOrders = async (req, res) => {
  const { user_id } = req.params; // Assuming user_id is passed as a parameter

  try {
    // Validate user exists in MySQL
    const [userResult] = await mysqlPool.query("SELECT * FROM Users WHERE user_id = ?", [user_id]);
    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch orders for the user from MongoDB
    const customerOrders = await Order.find({ user_id });

    // Transform the orders data
    const transformedOrders = await Promise.all(
      customerOrders.map(async (order, index) => {
        const transformedItems = await Promise.all(
          order.items.map(async (item) => {
            // Fetch item details (name, price) from the Menu table in MySQL
            const [menuResult] = await mysqlPool.query(
              "SELECT name, price FROM Menu WHERE menu_item_id = ?",
              [item.menu_item_id]
            );

            if (menuResult.length === 0) {
              return { name: "Unknown Item", quantity: item.quantity, price: 0 };
            }

            return {
              name: menuResult[0].name,
              quantity: item.quantity,
              order_id: order._id, // Use `order._id` here
              price: parseFloat(menuResult[0].price) * item.quantity,
            };
          })
        );

        return {
          id: index + 1, // Start from 1 and increment
          table: order.table_id,
          order_id: order._id, // Use `order._id` for unique identifier
          items: transformedItems,
          total: order.total_cost,
          status: order.status,
          timestamp: new Date(order.created_at).toISOString().slice(0, 19).replace("T", " "), // Format timestamp
        };
      })
    );

    res.status(200).json({ success: true, orders: transformedOrders });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateOrder = async (req, res, io) => {
  try {
    const { orderId, newStatus } = req.body;

    // Update the status in MongoDB
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Emit the updated order via WebSocket
    io.emit("orderStatusUpdated", updatedOrder);

    // Respond with the updated order data
    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
module.exports = { addOrder, getAllOrders ,getCustomerOrders,updateOrder };