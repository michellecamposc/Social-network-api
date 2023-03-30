const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

// Define routes
router.get("/user-test", UserController.userTest);

// Export router
module.exports = router;
