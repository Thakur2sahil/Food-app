const db = require("../../../db");

const newProduct = async (req, res) => {
  const imgpath = req.file.path.replace(/\\/g, "/");

  // const imgpath = `uploads/${req.file.filename}`;

  const { name, price, discount, category, description } = req.body;

  const insert =
    "INSERT INTO sahil.products(name, price, discount, photo, category, description) VALUES ($1, $2, $3, $4, $5, $6)";

  try {
    const data = await db.query(insert, [
      name,
      price,
      discount,
      imgpath,
      category,
      description,
    ]);
    res.json({ success: "The Product is registered", data });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Database insertion error" });
  }
};

module.exports = newProduct;
