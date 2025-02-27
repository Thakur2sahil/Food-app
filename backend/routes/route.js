const { Router } = require("express");
const { authRoutes } = require("./authRoutes/authRoutes");
const { adminRoutes } = require("./adminRoutes/adminRoutes");

const route = Router();

// Mounting authRoutes under '/auth' path
route.use("/auth", authRoutes);
route.use("/admin", adminRoutes);

module.exports = { route };
