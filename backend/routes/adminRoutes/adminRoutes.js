const { Router } = require("express");
const { login } = require("../../controller/authController/login");
const { signup } = require("../../controller/authController/singup");
const multer = require("multer");
const { newProduct } = require("../../controller/adminController/NewProductController/NewProductController");

const adminRoutes = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../backend/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

adminRoutes.post("/newproduct", newProduct);
adminRoutes.post("/signup", upload.single("image"), signup);

module.exports = { adminRoutes };
