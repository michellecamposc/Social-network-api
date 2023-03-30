const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/publication");

// Define routes
router.get("/publication-test", PublicationController.publicationTest);

// Export router
module.exports = router;
