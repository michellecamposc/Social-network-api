const User = require("../models/user");
const bcrypt = require("bcrypt");

const userTest = (req, res) => {
  return res.status(200).send({
    message: "Sent message from: controllers/user.js",
  });
};

const register = async (req, res) => {

  const { name, email, password, nick } = req.body;

  // Check and validate data
  if (!name || !email || !password || !nick) {
    return res.status(400).json({
      status: "error",
      message: "Missing data to send",
    });
  }

  // Create user object
  const userToSave = new User({ name, email, password, nick });

  // Duplicate user control
  try {
    const existingUser = await User.findOne({
      $or: [
        { email: userToSave.email.toLowerCase() },
        { nick: userToSave.nick.toLowerCase() },
      ],
    });

    if (existingUser) {
      return res.status(200).json({
        status: "success",
        message: "The user already exists",
      });
    }

    // Encrypt password
    const hash = await bcrypt.hash(userToSave.password, 10);
    userToSave.password = hash;

    // Save the user in Database
    await userToSave.save();

    // Response with success message and user object
    return res.status(200).json({
      status: "success",
      message: "User registration action",
      user: userToSave,
    });

  } catch (error) {
    // Response with error message and error object
    return res.status(500).json({
      status: "error",
      message: "Error registering user",
      error: error.message,
    });
  }
};

module.exports = {
  userTest,
  register,
};
