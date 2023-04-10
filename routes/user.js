const express = require("express");
const multer = require("multer");
const router = express.Router();
const UserController = require("../controllers/user");
const check = require("../middlewares/auth");

// Storage config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/avatars");
  },
  filename: (req, file, cb) => {
    const fileName = `avatar_${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});

// Middleware
const uploads = multer({ storage });

// Define routes
router.get("/user-test", check.auth, UserController.userTest);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", check.auth, UserController.profile);
router.get("/list/:page?", check.auth, UserController.list);
router.put("/update", check.auth, UserController.update);
router.post(
  "/upload",
  [check.auth, uploads.single("file0")],
  UserController.upload
);
router.get("/avatar/:file", UserController.avatar);
router.get("/counter/:id", check.auth, UserController.counters);

// Export router
module.exports = router;
