const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");
const mongoosePaginate = require("mongoose-paginate-v2");

const userTest = (req, res) => {
  return res.status(200).send({
    message: "Sent message from: controllers/user.js",
    user: req.user,
  });
};

// User registration function with password validation and encryption
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

// Implement login with JWT token authentication
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      status: "error",
      message: "Missing data to send",
    });
  }

  try {
    // Find in database if the user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "User doesn't exist",
      });
    }

    // Check password comparing
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).send({
        status: "error",
        message: "You have not correctly identified",
      });
    }

    // Return token
    const token = jwt.createToken(user);

    // Return user data
    return res.status(200).send({
      status: "success",
      message: "you have identified yourself correctly",
      user: {
        id: user._id,
        name: user.name,
        nick: user.nick,
      },
      token,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Add profile function to get user information without showing password or role.
const profile = async (req, res) => {
  // Receive the user id parameter
  const id = req.params.id;

  try {
    // Find in database if the user exist
    const userProfile = await User.findById(id, { password: 0, role: 0 });
    if (!userProfile) {
      return res.status(404).send({
        status: "error",
        message: "User doesn't exist or there is an error",
      });
    }

    // Return the result
    return res.status(200).json({
      status: "success",
      user: userProfile,
    });

    //Return follow information
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

//User path list
const list = async (req, res) => {
  // Control the page
  let page = parseInt(req.params.page) || 1;

  // Consult with mongoose paginate
  let itemPerPage = 1;

  try {
    const result = await User.paginate(
      {},
      { page, limit: itemPerPage, sort: { _id: 1 } }
    );
    return res.status(200).json({
      status: "success",
      page,
      itemPerPage,
      users: result.docs,
      total: result.total,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while processing your request",
      error,
    });
  }
};

module.exports = {
  userTest,
  register,
  login,
  profile,
  list,
};
