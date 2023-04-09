const express = require("express");
const router = express.Router();
const FollowController = require("../controllers/follow");
const check = require("../middlewares/auth");

// Define routes
router.get("/follow-test", FollowController.followTest);
router.post("/save", check.auth, FollowController.saveFollow);
router.delete("/unfollow/:id", check.auth, FollowController.unfollow);
router.get("/following/:id?/:page?", check.auth, FollowController.getFollowingUsers);
router.get("/followers/:id?/:page?", check.auth, FollowController.getFollowers);

// Export router
module.exports = router;
