const express = require("express");
const router = express.Router();
const FollowController = require("../controllers/follow");
const check = require("../middlewares/auth");


// Define routes
router.get("/follow-test", FollowController.followTest);
router.post("/save", check.auth, FollowController.saveFollow);

// Export router
module.exports = router;
