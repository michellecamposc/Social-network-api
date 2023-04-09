const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/publication");
const check = require("../middlewares/auth");


// Define routes
router.get("/publication-test", PublicationController.publicationTest);
router.post("/save", check.auth, PublicationController.savePublication);
router.get("/detail/:id", check.auth, PublicationController.detail);
router.delete("/remove/:id", check.auth, PublicationController.removePublication);
router.get("/user/:id", check.auth, PublicationController.userPost);




// Export router
module.exports = router;
