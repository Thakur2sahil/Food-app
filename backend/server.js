const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const secretKey = "your_secret_key";
const nodemailer = require("nodemailer");
const { sendEmail } = require("./emailService");
const fs = require("fs");
const db = require("./db");
const { route } = require("./routes/route");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api", route);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "/uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/signup", upload.single("image"), async (req, res) => {
  console.log("hello");

  try {
    const imgpath = `uploads/${req.file.filename.replace(/\\/g, "/")}`;
    const { fullName, username, email, password, role } = req.body;

    // Check if the email already exists
    const checkEmailQuery = "SELECT * FROM sahil.users WHERE email=$1";
    const emailResult = await db.query(checkEmailQuery, [email]);

    if (emailResult.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Insert the user data
    const insertQuery = `
            INSERT INTO sahil.users (full_name, username, email, password, role, image)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const insertResult = await db.query(insertQuery, [
      fullName,
      username,
      email,
      password,
      role,
      imgpath,
    ]);

    const newUser = insertResult.rows[0];

    // Create a JWT token with the user's role
    const payload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    // Prepare the HTML email content
    const userHtmlTable = `
            <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
                <thead>
                    <tr><th colspan="2">Registration Details</th></tr>
                </thead>
                <tbody>
                    <tr><td>Username:</td><td>${username}</td></tr>  <!-- Fixed variable name -->
                    <tr><td>Email:</td><td>${email}</td></tr>
                    <tr><td>Full Name:</td><td>${fullName}</td></tr>
                    <tr><td>Role:</td><td>${role}</td></tr>
                </tbody>
            </table>`;

    await sendEmail(
      email,
      "Registration Details",
      `Hello ${fullName},<br><br>You have successfully registered with the following details:<br>${userHtmlTable}<br>Please wait for login until the admin approves you.`
    );

    return res.json({
      success: "User registered successfully",
      user: newUser,
      token: token,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("emal:", email);
  console.log("passs:", password);

  // Check if the user exists with the provided email and password
  const select = "SELECT * FROM sahil.users WHERE email=$1 AND password=$2";

  db.query(select, [email, password], (err, data) => {
    if (err) {
      console.error({ err: "Database error" });
      return res.status(500).json("Database error");
    }
    console.log(data);

    if (data.rows.length > 0) {
      const user = data.rows[0];

      // Check if the user is approved
      // if (user.approved === false) { // Assuming approved is a boolean
      //     return res.status(403).json({ error: 'Your account is not approved by the admin. Please wait for approval.' });
      // }

      // Create a JWT payload with user's role (admin/user)
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role, // 'admin' or 'user'
      };

      // Sign the token with the secret key
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

      return res.status(200).json({
        message: "Successful Login",
        user: user,
        token: token, // Return the JWT token
      });
    } else {
      return res.status(404).json({ error: "Invalid email or password" });
    }
  });
});

app.post("/newproduct", upload.single("image"), (req, res) => {
  // const imgpath = req.file.path.replace(/\\/g, "/");

  const imgpath = `uploads/${req.file.filename}`;

  const { name, price, discount, category, description } = req.body;

  const insert =
    "INSERT into sahil.products(name,price, discount,photo,category,description) VALUES ($1,$2,$3,$4,$5,$6)";

  db.query(
    insert,
    [name, price, discount, imgpath, category, description],
    (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database insertion error" });
      } else {
        res.json({ success: "The Product is register", data });
      }
    }
  );
});

app.get("/ourproduct", (req, res) => {
  const query =
    "SELECT id, name, price, description, category, photo FROM sahil.products";

  db.query(query, (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    if (data.rows.length > 0) {
      return res.json(data.rows);
    } else {
      return res.json({ error: "No products found" });
    }
  });
});

app.get("/card", (req, res) => {
  const select =
    "SELECT id, name, description, price, category, photo, rating FROM sahil.products"; // Ensure rating is included

  db.query(select, (err, data) => {
    if (err) {
      console.error({ err: "Database Error" });
      return res.status(400).json("Error due to database");
    }

    if (data.rows.length > 0) {
      return res.json(data.rows);
    } else {
      return res.json({ err: "No data found" });
    }
  });
});

app.get("/updateproduct", (req, res) => {
  const query =
    "SELECT id, name, price, description, category, photo FROM sahil.products";

  db.query(query, (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    if (data.rows.length > 0) {
      return res.json(data.rows);
    } else {
      return res.json({ error: "No products found" });
    }
  });
});

async function checkexits(value) {
  const select =
    "SELECT EXISTS (SELECT 1 FROM sahil.cart WHERE product_id = $1)";
  const result = await db.query(select, [value]);
  return result.rows[0].exists;
}

app.post("/card1", (req, res) => {
  const { userId, pid, quantity } = req.body;

  const insert = `INSERT INTO sahil.cart(user_id, product_id, quantity) VALUES ($1, $2, $3)`;
  const update = `UPDATE sahil.cart SET quantity = quantity + 1 WHERE product_id = $1`;

  checkexits(pid)
    .then((exists) => {
      if (exists) {
        db.query(update, [pid], (err, data) => {
          if (err) {
            console.error("Error updating quantity: ", err);
            return res.status(500).json({ error: "Error updating quantity" });
          } else {
            return res.json({ message: "Quantity updated" });
          }
        });
      } else {
        db.query(insert, [userId, pid, quantity], (err, data) => {
          if (err) {
            console.error("Error inserting into cart: ", err);
            return res.status(500).json({ error: "Error inserting into cart" });
          } else {
            console.log("Insert successful: ", data);
            return res.status(200).json({ message: "Item added to cart" });
          }
        });
      }
    })
    .catch((err) => {
      console.error("Error checking existence: ", err);
      return res.status(500).json({ error: "Error checking cart" });
    });
});

app.post("/cart/increment", (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ error: "Missing userId or productId" });
  }

  const incrementQuery = `
        UPDATE sahil.cart 
        SET quantity = quantity + 1 
        WHERE user_id = $1 AND product_id = $2
        RETURNING quantity;
    `;

  db.query(incrementQuery, [userId, productId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    if (data.rows.length > 0) {
      return res.json(data.rows);
    } else {
      return res.json({ error: "No products found" });
    }
  });
});

// Decrement product quantity in the cart
app.post("/cart/decrement", (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ error: "Missing userId or productId" });
  }

  // Query to decrement the product's quantity
  const decrementQuery = `
        UPDATE sahil.cart 
        SET quantity = GREATEST(quantity - 1, 0) 
        WHERE user_id = $1 AND product_id = $2
        RETURNING quantity;
    `;

  db.query(decrementQuery, [userId, productId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database query error" });
    }

    if (data.rows.length > 0) {
      const newQuantity = data.rows[0].quantity;

      if (newQuantity === 0) {
        // If quantity becomes 0, remove the product from the cart
        const deleteQuery = `
                    DELETE FROM sahil.cart
                    WHERE user_id = $1 AND product_id = $2;
                `;

        db.query(deleteQuery, [userId, productId], (err, result) => {
          if (err) {
            console.error("Database error:", err);
            return res
              .status(500)
              .json({ error: "Failed to delete product from cart" });
          }

          return res.json({
            message: "Product removed from cart as quantity is 0",
            quantity: newQuantity,
          });
        });
      } else {
        // If quantity is updated but not 0, return the updated quantity
        return res.json({ message: "Quantity updated", quantity: newQuantity });
      }
    } else {
      return res.status(404).json({ error: "No product found in the cart" });
    }
  });
});

app.get("/cart", (req, res) => {
  const select = `
       SELECT p.photo, c.quantity, p.price, p.discount ,p.id,p.name
FROM sahil.products AS p 
INNER JOIN sahil.cart AS c 
ON p.id = c.product_id 
WHERE c.quantity > 0;
`;

  db.query(select, (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    if (data.rows.length > 0) {
      return res.json(data.rows);
    } else {
      return res.json({ error: "No products found" });
    }
  });
});

function generateRandomOrderId() {
  return Math.floor(Math.random() * 1000000); // Example: Generates a random number between 0 and 999999
}

// Example usage:

app.post("/orderpage", async (req, res) => {
  const { userId, totalAmount } = req.body;

  const uniqueOrderId = generateRandomOrderId();

  try {
    // Begin transaction
    await db.query("BEGIN");

    // Get user details for email (assuming you have a users table)
    const userResult = await db.query(
      "SELECT username, email, full_name FROM sahil.users WHERE id = $1",
      [userId]
    );
    if (userResult.rows.length === 0) {
      throw new Error("User not found");
    }

    const { username, email, full_name: fullName } = userResult.rows[0];
    console.log(`${email},${fullName}`);

    await sendEmail(
      email,
      "Order Placed",
      `Hello ${fullName},<br><br>Your order has been successfully placed.<br>Please wait for the admin to approve your order before logging in.`
    );

    // Get all cart items for the user with product details
    const cartItemsResult = await db.query(
      `
            SELECT cart.id, cart.product_id, cart.quantity, products.name as product_name, products.price
            FROM sahil.cart cart
            JOIN sahil.products products ON cart.product_id = products.id
            WHERE cart.user_id = $1
            `,
      [userId]
    );

    const cartItems = cartItemsResult.rows;

    if (cartItems.length === 0) {
      throw new Error("No items in the cart");
    }

    // Insert cart items into order_history with the same unique order ID
    for (let item of cartItems) {
      await db.query(
        "INSERT INTO sahil.order_history (order_id, user_id, quantity, status, created_at, product_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          uniqueOrderId,
          userId,
          item.quantity,
          "pending",
          new Date(),
          item.product_id,
        ]
      );
    }

    await db.query(
      "INSERT INTO sahil.cartamount(order_id, total_amount) VALUES($1, $2)",
      [uniqueOrderId, totalAmount]
    );

    // Update delivered column to false for the user's cart items
    await db.query(
      "UPDATE sahil.cart SET delivered = false WHERE user_id = $1",
      [userId]
    );

    // Delete cart items after placing the order
    await db.query("DELETE FROM sahil.cart WHERE user_id = $1", [userId]);

    // Commit transaction
    await db.query("COMMIT");

    // Prepare email content

    // Respond with success
    res
      .status(200)
      .json({ message: "Order placed successfully", orderId: uniqueOrderId });
  } catch (err) {
    // Rollback transaction in case of error
    await db.query("ROLLBACK");
    console.error("Error placing order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/profile", (req, res) => {
  const { userId } = req.body;
  const select = "SELECT * FROM sahil.users WHERE id = $1;";

  db.query(select, [userId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Check if data is available
    if (data.rows.length > 0) {
      console.log(data.rows); // Log the data for debugging
      return res.status(200).json(data.rows); // Return the data as response
    } else {
      return res.status(404).json({ message: "No data available" });
    }
  });
});

app.post("/updateprofile", upload.single("file"), (req, res) => {
  const { userid: userId, username, email } = req.body;

  // Check for required fields
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const updateFields = [];
  const values = [];

  if (username) {
    updateFields.push(`username = $${values.length + 1}`);
    values.push(username);
  }
  if (email) {
    updateFields.push(`email = $${values.length + 1}`);
    values.push(email);
  }

  if (req.file) {
    const filename = `uploads/${req.file.filename.replace(/\\/g, "/")}`;
    updateFields.push(`image = $${values.length + 1}`);
    values.push(filename);
  }

  if (updateFields.length > 0) {
    const updateQuery = `UPDATE sahil.users SET ${updateFields.join(
      ", "
    )} WHERE id = $${values.length + 1}`;

    db.query(updateQuery, [...values, userId], (err) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      // Fetch the updated user details
      const fetchQuery = `SELECT username, email, image FROM sahil.users WHERE id = $1`;
      db.query(fetchQuery, [userId], (err, result) => {
        if (err) {
          console.error("Error fetching user data:", err);
          return res.status(500).json({ error: "Error fetching user data" });
        }

        // Check if user was found
        if (result.rows.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        // Return the updated user details
        const updatedUser = result.rows[0];
        return res
          .status(200)
          .json({ message: "Profile updated successfully", user: updatedUser });
      });
    });
  } else {
    return res.status(400).json({ error: "No fields to update" });
  }
});

app.post("/selectproduct", (req, res) => {
  const { productid } = req.body;

  const select = "select * from sahil.products where id=$1";

  db.query(select, [productid], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ err: "Database error" });
    }
    if (data.rows.length > 0) {
      console.log(data.rows[0]);
      return res.status(200).json(data.rows);
    } else {
      return res.status(400).json("No data available");
    }
  });
});

app.post("/deleteproduct", (req, res) => {
  const { productid } = req.body;

  const insert = `delete from sahil.products
        where id=$1`;
  db.query(insert, [productid], (err, data) => {
    if (err) {
      return res.status(500).json({ err: "Database error" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Data deleted successfully" });
  });
});

app.post("/productupdate", (req, res) => {
  const { productid } = req.body;

  const select = "select * from sahil.products where id=$1";

  db.query(select, [productid], (err, data) => {
    if (err) {
      return res.status(500).json({ err: "Database error" });
    }
    if (data.rows.length > 0) {
      console.log(data.rows);
      return res.status(200).json(data.rows);
    } else {
      return res.status(400).json("No data Avialabe");
    }
  });
});

app.post("/upproduct", upload.single("image"), (req, res) => {
  const { name, price, description, category, discount, productid } = req.body;
  const updates = [];
  const values = [];

  if (name) {
    updates.push(`name = $${updates.length + 1}`);
    values.push(name);
  }
  if (price) {
    updates.push(`price = $${updates.length + 1}`);
    values.push(price);
  }
  if (description) {
    updates.push(`description = $${updates.length + 1}`);
    values.push(description);
  }
  if (category) {
    updates.push(`category = $${updates.length + 1}`);
    values.push(category);
  }
  if (discount) {
    updates.push(`discount = $${updates.length + 1}`);
    values.push(discount);
  }
  if (req.file) {
    const image = `uploads/${req.file.filename.replace(/\\/g, "/")}`;
    updates.push(`photo = $${updates.length + 1}`);
    values.push(image);
  }

  if (updates.length === 0) {
    return res.status(400).json("No fields to update");
  }

  const updateQuery = `UPDATE sahil.products SET ${updates.join(
    ", "
  )} WHERE id = $${updates.length + 1}`;
  values.push(productid);

  console.log("Update Query:", updateQuery, "Values:", values);

  db.query(updateQuery, values, (err, data) => {
    if (err) {
      console.error("Database Error:", err.message);
      return res.status(500).json("Database Error");
    }
    if (data.rowCount > 0) {
      console.log("Product updated successfully");
      return res
        .status(200)
        .json({ success: true, message: "Product updated successfully" });
    } else {
      return res.status(404).json("No product found or no fields were updated");
    }
  });
});

app.post("/ordercard", (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("No user Id availabe");
  }
  const select = `SELECT o.order_id, o.user_id, o.product_id, o.quantity, p.photo AS photo, p.name, p.price, c.total_amount 
FROM sahil.order_history o 
JOIN sahil.products p ON o.product_id = p.id 
JOIN sahil.cartamount c ON o.order_id = c.order_id 
WHERE o.user_id = $1 AND o.status = 'pending';`;

  db.query(select, [userId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    if (data.rows && data.rows.length > 0) {
      console.log(data.rows);
      return res.status(200).json(data.rows);
    } else {
      return res.status(400).json("No data found");
    }
  });
});

app.post("/orderdel", (req, res) => {
  const { orderId, userId } = req.body;

  const del =
    "DELETE FROM sahil.order_history WHERE order_id=$1 AND user_id=$2";

  db.query(del, [orderId, userId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ err: "Error deleting the order" });
    }
    console.log(`Order ID ${orderId} deleted for user ID ${userId}`);
    return res.status(200).json({ message: "Data deleted successfully" });
  });
});

app.post("/orderreq", (req, res) => {
  const select = `
SELECT o.order_id, o.user_id, o.product_id, o.quantity, p.photo AS photo, p.name, p.price, c.total_amount as totalamount
FROM sahil.order_history o 
JOIN sahil.products p ON o.product_id = p.id 
JOIN sahil.cartamount c ON o.order_id = c.order_id 
WHERE  o.status = 'pending';`;

  db.query(select, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    if (data.rows && data.rows.length > 0) {
      return res.status(200).json(data.rows);
    } else {
      return res.status(400).json("No data found");
    }
  });
});

app.post("/accept", async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "orderId is required" });
  }

  try {
    // Update order status to 'approved' and get the associated user ID
    const updateQuery =
      "UPDATE sahil.order_history SET status = 'approved' WHERE order_id = $1 RETURNING user_id";
    const { rows } = await db.query(updateQuery, [orderId]);

    // Check if the order exists
    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const userId = rows[0].user_id;

    // Fetch user details based on user ID
    const userQuery =
      "SELECT username, email, full_name FROM sahil.users WHERE id = $1";
    const userResult = await db.query(userQuery, [userId]);

    // Check if user exists
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const { username, email, full_name: fullName } = userResult.rows[0];
    // console.log(`${email},${fullName}`);
    console.log(fullName);

    // Send email to the user notifying them about their order approval
    await sendEmail(
      email,
      "Your Order Has Been Approved",
      `Hello ${fullName},<br><br>
            We are pleased to inform you that your order with ID ${orderId} has been approved.<br>
            Thank you for your purchase!<br>`
    );

    // Respond with success message
    return res
      .status(200)
      .json({ message: "Order has been approved and user notified" });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/cancel", async (req, res) => {
  const { orderId } = req.body;

  console.log(orderId);

  // Validate the orderId input
  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  try {
    // Update order status to 'canceled' and get the associated user ID
    const updateQuery =
      "UPDATE sahil.order_history SET status = 'canceled' WHERE order_id = $1 RETURNING user_id";
    const { rows } = await db.query(updateQuery, [orderId]);

    // Check if the order exists
    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const userId = rows[0].user_id;

    // Fetch user details based on user ID
    const userQuery =
      "SELECT username, email, full_name FROM sahil.users WHERE id = $1"; // Adjust the selected fields as necessary
    const userResult = await db.query(userQuery, [userId]);

    const { username, email, full_name: fullName } = userResult.rows[0];
    // console.log(`${email},${fullName}`);

    // Send email to the user notifying them about their order cancellation
    await sendEmail(
      email,
      "Your Order Has Been Canceled",
      ` Hello ${fullName},<br><br>
            We regret to inform you that your order with ID ${orderId} has been canceled.<br>`
    );

    // Delete the products associated with the canceled order
    const deleteProductsQuery =
      "DELETE FROM sahil.order_history WHERE user_id = $1 and status= 'canceled'";
    await db.query(deleteProductsQuery, [userId]);

    // Respond with success message
    return res
      .status(200)
      .json({
        message: "Order has been canceled, products removed, and user notified",
      });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/purchasehistory", (req, res) => {
  const { userId } = req.body;

  const select =
    "select o.order_id ,o.id, p.photo as photo, p.id as product_id , o.quantity ,o.status, o.rating,TO_CHAR(o.created_at, 'YYYY-MM-DD') as date from sahil.order_history as o inner join sahil.products as p on o.product_id = p.id  where user_id =$1  ";

  db.query(select, [userId], (err, data) => {
    if (err) {
      return res.status(500).json({ err: "Error generate" });
    }
    if (data.rows.length > 0) {
      console.log(data.rows);
      return res.status(200).json(data.rows);
    } else {
      return res.status(400).json("No data found");
    }
  });
});

// Update rating for a specific order
app.post("/updaterating", async (req, res) => {
  const { orderId, rating } = req.body;

  try {
    await db.query("BEGIN");

    // Get current rating and rating_count
    const currentQuery =
      "SELECT rating, rating_count FROM sahil.order_history WHERE order_id = $1 AND status = 'approved'";
    const currentResult = await db.query(currentQuery, [orderId]);

    if (currentResult.rows.length === 0) {
      return res.status(404).json({ err: "Order not found or not approved" });
    }

    const currentRating = currentResult.rows[0].rating || 0;
    const currentCount = currentResult.rows[0].rating_count || 0;

    // Calculate the new average rating
    // If the user has rated before, adjust the rating accordingly
    const newCount = currentCount + 1; // Increment count
    const newRating = (currentRating * currentCount + rating) / newCount; // New average

    // Update the database with the new rating and count
    const updateQuery =
      "UPDATE sahil.order_history SET rating = $1, rating_count = $2 WHERE order_id = $3 AND status = 'approved'";
    await db.query(updateQuery, [newRating, newCount, orderId]);

    await db.query("COMMIT");

    return res.status(200).json({ message: "Rating updated successfully" });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Failed to update rating", err);
    return res.status(500).json({ err: "Failed to update rating" });
  }
});

app.get("/order-history", async (req, res) => {
  try {
    const query = `
           SELECT 
    DATE_TRUNC('month', created_at) AS month, 
    COUNT(*) AS total_orders 
FROM 
    sahil.order_history 
WHERE 
    status = 'approved' 
GROUP BY 
    month 
ORDER BY 
    month ASC;
        `; // Adjust table and column names as per your database structure

    const { rows } = await db.query(query);
    res.json(rows); // Send back the order data
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ message: "Failed to fetch order history" });
  }
});

app.get("/users/not-approved", async (req, res) => {
  try {
    const query = "SELECT * FROM sahil.users WHERE approved = 'false'"; // Assuming status column exists
    const { rows } = await db.query(query);
    console.log(rows);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/acceptuser", async (req, res) => {
  const { userId } = req.body;

  // Validate userId
  if (!userId) {
    return res.status(400).json("User ID is required");
  }

  // Update query to set approved and return the user's username and email
  const updateQuery =
    "UPDATE sahil.users SET approved = true WHERE id = $1 RETURNING username, email";

  try {
    const { rows } = await db.query(updateQuery, [userId]);
    console.log(rows);
    // Check if the user was found and updated
    if (rows.length === 0) {
      return res.status(404).json("No matching record found");
    }

    const { username, email } = rows[0];

    // Sending email notification after successful update
    try {
      await sendEmail(
        email,
        "User Approved",
        `
                <p>Hello ${username},</p>
                <p>Your account has been approved successfully.</p>
                <p>Thank you for your patience!</p>
                `
      );
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return res.status(500).json("User updated, but failed to send email.");
    }

    return res.status(200).json("Update successful");
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json("Database error");
  }
});

app.post("/canceluser", async (req, res) => {
  const { userId } = req.body;

  // Validate userId
  if (!userId) {
    return res.status(400).json("User ID is required");
  }

  const deleteQuery =
    "DELETE FROM sahil.users WHERE id = $1 RETURNING email, username";

  try {
    const { rows } = await db.query(deleteQuery, [userId]);

    // Check if the user was found and deleted
    // if (rows.length === 0) {
    //     console.log("No user found with that ID");
    //     return res.status(404).json("No user found with that ID");
    // }

    const { email, username } = rows[0];

    // Sending email notification after successful deletion
    try {
      await sendEmail(
        email,
        "Account Cancellation",
        `
                <p>Hello ${username},</p>
                <p>Your account has been successfully canceled.</p>
                <p>If you have any questions, please contact us.</p>
                `
      );
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Optionally, you can choose to notify the user that email sending failed.
      // return res.status(500).json("User deleted, but failed to send email.");
    }

    return res.status(200).json("User deleted successfully");
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json("Database error");
  }
});

app.post("/otp", async (req, res) => {
  const { userId } = req.body;

  try {
    // Fetch user details from the database
    const user = await db.query("SELECT * FROM sahil.users WHERE id = $1", [
      userId,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userEmail = user.rows[0].email;
    const username = user.rows[0].username; // Fetch username from user data

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP and its expiry time in the database
    await db.query(
      "UPDATE sahil.users SET otp = $1, otp_expires_at = $2 WHERE id = $3",
      [
        otp,
        new Date(Date.now() + 15 * 60 * 1000), // OTP valid for 15 minutes
        userId,
      ]
    );

    // Send the OTP email
    try {
      await sendEmail(
        userEmail,
        "Your OTP Code",
        `
                <p>Hello ${username},</p>
                <p>Your OTP code is <strong>${otp}</strong>.</p>
                <p>This code is valid for 15 minutes. Please do not share it with anyone.</p>
                <p>Thank you!</p>
                `
      );
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return res.status(500).json("User updated, but failed to send email.");
    }

    res.status(200).json({ message: "OTP sent successfully to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/reset-password", async (req, res) => {
  const { otp, newPassword } = req.body;
  const otp_val = otp;
  console.log(otp_val); // Check if the OTP value is logged correctly

  try {
    // Fetch the user based on the provided OTP
    const user = await db.query("SELECT * FROM sahil.users WHERE otp = $1", [
      otp_val,
    ]);
    console.log(user.rows); // Log the user data to check if it's fetched correctly

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update the user's password in the database
    await db.query("UPDATE sahil.users SET password = $1 WHERE otp = $2", [
      newPassword,
      otp_val,
    ]);

    // Clear OTP and expiry in the database
    await db.query(
      "UPDATE sahil.users SET otp = NULL, otp_expires_at = NULL WHERE otp = $1",
      [otp_val]
    );

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.post("/profile", (req, res) => {
  const { userId } = req.body;
  const select = "SELECT * FROM sahil.users WHERE id = $1;";

  db.query(select, [userId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Check if data is available
    if (data.rows.length > 0) {
      return res.status(200).json(data.rows); // Return the data as response
    } else {
      return res.status(404).json({ message: "No data available" });
    }
  });
});

app.post("/cartCount", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  console.log("User ID received:", userId); // Log the user ID

  try {
    const result = await db.query(
      `SELECT SUM(quantity) AS itemcount FROM sahil.cart WHERE user_id = $1`,
      [userId]
    );

    console.log("Query Result:", result); // Log the entire result

    if (result.rows.length > 0) {
      const { itemcount } = result.rows[0]; // Update to use itemcount
      console.log("Item Count:", itemcount); // Log the item count

      return res.json({ count: parseInt(itemcount, 10) }); // Return as integer
    }

    res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/customer_contacts", async (req, res) => {
  const { name, email, favorite_food, message } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  // SQL query to insert the contact information
  const insertQuery = `
        INSERT INTO sahil.customer_contacts (name, email, favorite_food, message)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
    `;

  try {
    const result = await db.query(insertQuery, [
      name,
      email,
      favorite_food,
      message,
    ]);
    const newContactId = result.rows[0].id; // Get the newly created contact ID

    return res.status(201).json({
      message: "Contact information saved successfully!",
      id: newContactId,
    });
  } catch (error) {
    console.error("Error saving contact information:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/cart/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await db.query(
      `SELECT sahil.cart.id, sahil.products.name, sahil.products.price, sahil.products.photo, sahil.products.discount, sahil.cart.quantity, sahil.cart.added_at 
            FROM sahil.cart 
            JOIN sahil.products ON sahil.cart.product_id = sahil.products.id 
            WHERE sahil.cart.user_id = $1`,
      [userId]
    );
    res.json(cartItems.rows);
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).send("Server error");
  }
});

app.get("/profiledata", async (req, res) => {
  const { userId } = req.query; // Changed from req.params to req.query

  const select = `SELECT * FROM sahil.users WHERE id = $1`;

  db.query(select, [userId], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (data.rows.length > 0) {
      // Use .length instead of > 0
      console.log(data.rows);
      return res.status(200).json(data.rows[0]); // Return the first row directly
    } else {
      return res.status(400).json("No data found");
    }
  });
});

app.post("/submit-rating", async (req, res) => {
  const { userId, orderId, rating } = req.body;

  console.log(`${userId},${orderId},${rating}`);

  try {
    // Fetch product_id from the order
    const orderResult = await db.query(
      "SELECT product_id FROM sahil.order_history WHERE id = $1 AND user_id = $2",
      [orderId, userId]
    );
    if (orderResult.rows.length === 0) {
      return res.status(404).send("Order not found");
    }

    const { product_id } = orderResult.rows[0];
    console.log(product_id);

    // Insert rating into sahil.order_history table
    await db.query("UPDATE sahil.order_history SET rating = $1 WHERE id = $2", [
      rating,
      orderId,
    ]);

    await db.query(
      "INSERT INTO sahil.user_product_ratings (user_id, product_id, order_id, rating, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)",
      [userId, product_id, orderId, rating]
    );

    // Fetch current rating and rating count from sahil.products
    const productResult = await db.query(
      "SELECT rating, rating_count FROM sahil.products WHERE id = $1",
      [product_id]
    );
    const { rating: currentRating, rating_count: ratingCount } =
      productResult.rows[0];

    console.log(`${currentRating},${ratingCount}`);

    // Calculate new rating and increment count
    const newRating =
      (currentRating * ratingCount + rating) / (ratingCount + 1);
    const newRatingCount = ratingCount + 1;

    // Update product rating and rating count in the sahil.products table
    await db.query(
      "UPDATE sahil.products SET rating = $1, rating_count = $2 WHERE id = $3",
      [newRating, newRatingCount, product_id]
    );

    res.send("Rating submitted successfully");
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).send("Server error");
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const result = await db.query(`
        SELECT DISTINCT u.id, u.username 
        FROM sahil.users u
        JOIN sahil.order_history oh ON u.id = oh.user_id
      `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/api/orders", async (req, res) => {
  const { userId, date, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = `
        SELECT oh.*, u.username
        FROM sahil.order_history oh
        LEFT JOIN sahil.users u ON oh.user_id = u.id
        WHERE 1=1
    `;

  const values = [];
  if (userId) {
    query += ` AND oh.user_id = $${values.length + 1}`;
    values.push(userId);
  }
  if (date) {
    query += ` AND DATE(oh.created_at) = $${values.length + 1}`;
    values.push(date);
  }

  query += ` ORDER BY oh.created_at DESC LIMIT $${values.length + 1} OFFSET $${
    values.length + 2
  }`;
  values.push(limit, offset);

  try {
    const { rows } = await db.query(query, values);

    // Count query
    const totalQuery = `
            SELECT COUNT(*) 
            FROM sahil.order_history oh
            WHERE 1=1
            ${userId ? `AND oh.user_id = $1` : ""}
            ${date ? `AND DATE(oh.created_at) = $${userId ? 2 : 1}` : ""}
        `;

    const totalValues = [];
    if (userId) totalValues.push(userId);
    if (date) totalValues.push(date);

    const total = await db.query(totalQuery, totalValues);
    const totalOrders = total.rows[0].count;

    res.json({ orders: rows, totalOrders });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).send("Server Error");
  }
});

app.get("/rate", async (req, res) => {
  const { pid } = req.query;
  console.log(`Pid is ${pid}`);

  if (!pid) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    const query = `
            SELECT u.user_id, u.product_id, u.order_id, u.rating, us.username 
            FROM sahil.user_product_ratings AS u 
            JOIN sahil.users AS us ON u.user_id = us.id 
            WHERE u.product_id = $1
        `;
    const result = await db.query(query, [pid]);

    if (result.rows.length > 0) {
      return res.status(200).json(result.rows);
    } else {
      return res
        .status(404)
        .json({ message: "No ratings found for this product" });
    }
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

app.listen(8004, () => {
  console.log("Listening on port 8004");
});
