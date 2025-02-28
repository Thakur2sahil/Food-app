const { Router } = require("express");
const multer = require("multer");
const newProduct = require("../../controller/adminController/NewProductController/NewProductController");

const adminRoutes = Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    // Ensure unique filename by adding a timestamp
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
adminRoutes.post("/newproduct", upload.single("image"), newProduct);

module.exports = { adminRoutes };
