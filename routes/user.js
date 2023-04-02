const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const check = require("../middlewares/auth");

// Define routes
router.get("/user-test", check.auth, UserController.userTest);
router.post("/register", UserController.register);
router.post("/login", UserController.login);

// Export router
module.exports = router;
