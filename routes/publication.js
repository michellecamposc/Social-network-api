const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/publication");
const check = require("../middlewares/auth");


// Define routes
router.get("/publication-test", PublicationController.publicationTest);
router.post("/save", check.auth, PublicationController.savePublication);

// Export router
module.exports = router;
