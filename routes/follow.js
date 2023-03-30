const express = require("express");
const router = express.Router();
const FollowController = require("../controllers/follow");

// Define routes
router.get("/follow-test", FollowController.followTest);

// Export router
module.exports = router;
