const express = require("express");
const multer = require("multer");
const router = express.Router();
const PublicationController = require("../controllers/publication");
const check = require("../middlewares/auth");

// Storage config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/publications");
  },
  filename: (req, file, cb) => {
    const fileName = `pub_${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});

// Middleware
const uploads = multer({ storage });

// Define routes
router.get("/publication-test", PublicationController.publicationTest);
router.post("/save", check.auth, PublicationController.savePublication);
router.get("/detail/:id", check.auth, PublicationController.detail);
router.delete(
  "/remove/:id",
  check.auth,
  PublicationController.removePublication
);
router.get("/user/:id", check.auth, PublicationController.userPost);
router.post(
  "/upload/:id",
  [check.auth, uploads.single("file0")],
  PublicationController.upload
);
router.get("/media/:file", check.auth, PublicationController.media);

// Export router
module.exports = router;
