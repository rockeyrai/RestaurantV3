const { mysqlPool } = require("../database/mysql");

const fetchMenu = async (req, res) => {
  const query = `
SELECT 
    m.menu_item_id,
    m.name,
    m.description,
    CAST(m.price AS DECIMAL(10, 2)) AS original_price,
    ROUND(IFNULL(
        CAST(m.price AS DECIMAL(10, 2)) * (1 - IFNULL(o.discount_percentage, 0) / 100),
        CAST(m.price AS DECIMAL(10, 2))
    ), 2) AS final_price,
    IFNULL(CAST(o.discount_percentage AS DECIMAL(5, 2)), 0) AS discount_percentage,
    o.start_date AS offer_start_date,
    o.end_date AS offer_end_date,
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
};


module.exports = { fetchMenu };
