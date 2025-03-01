const { mysqlPool } = require("../database/mysql");

// Routes for Tags
const addTags = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Tag name is required." });
  }

  const query = 'INSERT INTO Tags (name) VALUES (?)';

  try {
    const [results] = await mysqlPool.query(query, [name]);
    console.log("Tag added:", results);
    return res.status(201).json({ msg: `The tag "${name}" has been applied to the menu.` });
  } catch (err) {
    console.error("Error inserting tag:", err);
    return res.status(500).json({ error: "Failed to insert tag." });
  }
};

// Routes for Offers
const addOffer = async (req, res) => {
  const { menu_item_id, discount_percentage, offer_type, start_date, end_date } = req.body;

  if (!menu_item_id || !discount_percentage || !offer_type || !start_date || !end_date) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const query = `
    INSERT INTO Offers (menu_item_id, discount_percentage, offer_type, start_date, end_date)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    const [results] = await mysqlPool.query(query, [menu_item_id, discount_percentage, offer_type, start_date, end_date]);
    console.log("Offer added:", results);
    return res.status(201).json({ msg: "The offer has been applied." });
  } catch (err) {
    console.error("Error inserting offer:", err);
    return res.status(500).json({ error: "Failed to insert offer." });
  }
};

// Routes for Categories
const addCategories = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Category name is required." });
  }

  const query = 'INSERT INTO Categories (name) VALUES (?)';

  try {
    const [results] = await mysqlPool.query(query, [name]);
    console.log("Category added:", results);
    return res.status(201).json({ msg: `New category "${name}" has been added.` });
  } catch (err) {
    console.error("Error inserting category:", err);
    return res.status(500).json({ error: "Failed to insert category." });
  }
};

module.exports = { addCategories, addOffer, addTags };
