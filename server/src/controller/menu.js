const { mysqlPool } = require("../database/mysql");

const fetchMenu = async (req, res) => {
  const query = `
SELECT 
    m.menu_item_id,
    m.name,
    m.description,
    CAST(m.price AS DECIMAL(10, 2)) AS original_price,
    ROUND(
        CASE 
            WHEN o.offer_type = 'percentage' THEN 
                m.price * (1 - IFNULL(o.discount_percentage, 0) / 100) -- Apply percentage discount
            WHEN o.offer_type = 'fixed_price' THEN 
                GREATEST(0, m.price - IFNULL(o.discount_percentage, 0)) -- Deduct fixed price discount, ensure no negative value
            ELSE 
                m.price -- No discount
        END,
        2
    ) AS final_price,
    IFNULL(CAST(o.discount_percentage AS DECIMAL(5, 2)), 0) AS discount_percentage,
    o.start_date AS offer_start_date,
    o.end_date AS offer_end_date,
    o.offer_type AS offer_type, -- Added to GROUP BY
    c.name AS category_name,
    CAST(m.availability AS UNSIGNED) AS availability,
    
    -- Aggregate unique tag names while filtering out null values
    (SELECT JSON_ARRAYAGG(t.name)
     FROM Tags t
     JOIN Menu_Tags mt ON mt.tag_id = t.tag_id
     WHERE mt.menu_item_id = m.menu_item_id AND t.name IS NOT NULL) AS tags,
    
    -- Aggregate unique image URLs while filtering out null values
    (SELECT JSON_ARRAYAGG(mi.image_url)
     FROM Menu_Images mi
     WHERE mi.menu_item_id = m.menu_item_id AND mi.image_url IS NOT NULL) AS image_urls

FROM Menu m
LEFT JOIN Dynamic_Pricing dp 
    ON m.menu_item_id = dp.menu_item_id
    AND TIME(NOW()) BETWEEN dp.start_time AND dp.end_time
    AND FIND_IN_SET(DAYNAME(NOW()), dp.days_of_week) > 0
LEFT JOIN Offers o 
    ON m.menu_item_id = o.menu_item_id
    AND NOW() BETWEEN o.start_date AND o.end_date
LEFT JOIN Categories c 
    ON m.category_id = c.category_id
LEFT JOIN Menu_Tags mt
    ON m.menu_item_id = mt.menu_item_id
LEFT JOIN Tags t
    ON mt.tag_id = t.tag_id
LEFT JOIN Menu_Images mi 
    ON m.menu_item_id = mi.menu_item_id
GROUP BY 
    m.menu_item_id, 
    m.name, 
    m.description, 
    m.price, 
    dp.price, 
    o.discount_percentage, 
    o.offer_type,   -- Added here
    o.start_date, 
    o.end_date, 
    c.name, 
    m.availability;
`;

  try {
      const [results] = await mysqlPool.query(query);

      // No need for JSON.parse as JSON_ARRAYAGG produces valid JSON arrays
      const formattedResults = results.map((row) => ({
          menu_item_id: row.menu_item_id,
          name: row.name,
          description: row.description,
          original_price: row.original_price,
          final_price: row.final_price,
          discount_percentage: row.discount_percentage,
          offer_start_date: row.offer_start_date,
          offer_end_date: row.offer_end_date,
          category_name: row.category_name,
          availability: row.availability,
          tags: row.tags || [], // Directly use tags as is
          image_urls: row.image_urls || [], // Directly use image URLs as is
      }));

      res.json(formattedResults);
  } catch (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal Server Error" });
  }
}

// Controller to handle adding a menu item
 const addMenu = async (req, res) => {
    const { name, description, price, categories, availability, image_url, tags } = req.body;
  
    // Validate required fields
    if (!name || !price || !categories) {
      return res.status(400).json({ message: 'Name, price, and category name are required' });
    }
  
    const connection = await mysqlPool.getConnection();
    await connection.beginTransaction();
  
    try {
      // Check if the category exists, or insert it
      let categoryId;

      if (Array.isArray(categories) && categories.length > 0) {
        const categoryName = categories[0]; // Use the first category for now
    
        // Check if the category exists, or insert it
        const [categoryResult] = await connection.execute(
          'SELECT category_id FROM Categories WHERE name = ?',
          [categoryName]
        );
    
        if (categoryResult.length > 0) {
          categoryId = categoryResult[0].category_id; // Category exists, use its ID
        } else {
          // Insert new category if it does not exist
          const [insertedCategory] = await connection.execute(
            'INSERT INTO Categories (name) VALUES (?)',
            [categoryName]
          );
          categoryId = insertedCategory.insertId; // Get the new category ID
        }
      } else {
        throw new Error("Invalid categories data. Categories should be a non-empty array.");
      }
    
      // Insert the new menu item
      const query = `
        INSERT INTO Menu (name, description, price, category_id, availability)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [menuResult] = await connection.execute(query, [name, description, price, categoryId, availability || true]);
    
      // Get the menu_item_id of the newly inserted menu item
      const menuItemId = menuResult.insertId;
  
      // If there are tags, insert them into the Menu_Tags table
      if (tags && tags.length > 0) {
        for (const tag of tags) {
          // Check if the tag exists in the Tags table, or insert it if it doesn't
          const [existingTag] = await connection.execute(
            'SELECT tag_id FROM Tags WHERE name = ?',
            [tag]
          );
  
          let tagId;
          if (existingTag.length > 0) {
            tagId = existingTag[0].tag_id; // Tag exists, use existing ID
          } else {
            // Insert the new tag and get the tag_id
            const [newTagResult] = await connection.execute(
              'INSERT INTO Tags (name) VALUES (?)',
              [tag]
            );
            tagId = newTagResult.insertId;
          }
  
          // Now insert the menu_item_id and tag_id into the Menu_Tags table
          await connection.execute(
            'INSERT INTO Menu_Tags (menu_item_id, tag_id) VALUES (?, ?)',
            [menuItemId, tagId]
          );
        }
      }
  
      // If the image URL is provided, insert it into the Menu_Images table
      if (image_url) {
        await connection.execute(
          'INSERT INTO Menu_Images (menu_item_id, image_url) VALUES (?, ?)',
          [menuItemId, image_url]
        );
      }
  
      // Commit the transaction
      await connection.commit();
  
      // Return a success response
      return res.status(201).json({
        message: 'Menu item with category, tags, and image added successfully',
        menu_item_id: menuItemId, // Returning the new item ID
        category_id: categoryId,  // Returning the category ID
      });
    } catch (err) {
      // Rollback the transaction in case of an error
      await connection.rollback();
      console.error(err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    } finally {
      // Release the connection
      connection.release();
    }
  };


const fetchCategorues = async (req, res) => {
    try {
      const query = "SELECT category_id, name FROM Categories";
      const [rows] = await mysqlPool.query(query); // Adjust based on your database library
      const categories = rows.map(row => ({
        category_id: row.category_id,
        name: row.name,
      }));
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

// Get tags API
const fetchTags = async (req, res) => {
  try {
    const query = "SELECT tag_id, name FROM Tags";
    const [rows] = await mysqlPool.query(query); // Adjust based on your database library
    const tags = rows.map(row => ({
      tag_id: row.tag_id,
      name: row.name,
    }));
    res.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { fetchMenu, addMenu, fetchCategorues, fetchTags };
