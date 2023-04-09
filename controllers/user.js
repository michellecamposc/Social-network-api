const User = require("../models/user");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const mime = require("mime");

// Import services
const jwt = require("../services/jwt");
const followService = require("../services/followService");

// Just for testing
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
      return res.status(409).json({
        status: "error",
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
      message: "User successfully registered",
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

    // Tracking information
    const followInformation = await followService.followThisUser(
      req.user.id,
      id
    );

    // Return the result
    return res.status(200).json({
      status: "success",
      user: userProfile,
      following: followInformation.following,
      follower: followInformation.followers,
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
  let itemsPerPage = 4;

  try {
    const result = await User.paginate(
      {},
      { page, limit: itemsPerPage, sort: { _id: 1 } }
    );

    // Calculate the total pages
    const total = result.total;
    const totalPages = Math.ceil(total / itemsPerPage);

    return res.status(200).json({
      status: "success",
      users: result.docs,
      page,
      itemsPerPage,
      totalPages,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while processing your request",
    });
  }
};

// Update a user in a database
const update = async (req, res) => {
  const userIdentity = req.user;
  let usertoUpdate = { ...req.body };

  // Delete object properties
  delete usertoUpdate.role;
  delete usertoUpdate.iat;
  delete usertoUpdate.exp;
  delete usertoUpdate.image;

  try {
    const existingUser = await User.findOne({
      $or: [
        { email: usertoUpdate.email.toLowerCase() },
        { nick: usertoUpdate.nick.toLowerCase() },
      ],
    });

    if (existingUser && existingUser.id !== userIdentity.id) {
      return res.status(409).json({
        status: "error",
        message: "User already exists",
      });
    }

    // Encrypt password
    if (usertoUpdate.password) {
      const hash = await bcrypt.hash(usertoUpdate.password, 10);
      usertoUpdate.password = hash;
    }

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userIdentity.id },
      usertoUpdate,
      { new: true }
    );

    // Response with success
    return res.status(200).json({
      status: "success",
      message: "User updated successfully",
      userIdentity: updatedUser,
    });
  } catch (error) {
    // Response with error message and error object
    return res.status(500).json({
      status: "error",
      message: "Failed to update user",
      error: error.message,
    });
  }
};

// Upload an image
const upload = async (req, res) => {
  // If an image has not been uploaded
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      message: "The request does not include the image",
    });
  }

  // Know the file extension
  let fileName = req.file.originalname;
  const fileExtension = path.extname(fileName);

  //Verify the file extension is an image
  const isImage = mime.lookup(fileExtension).match(/^image\//);

  if (!isImage) {
    // Delete the file
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.log(err);
      }
    });

    return res.status(400).json({
      status: "error",
      message: "Only image files are allowed",
    });
  } else {
    // Find and update the image
    let updatedImage = await User.findOneAndUpdate(
      { _id: req.user.id },
      { image: req.file.filename },
      { new: true }
    );
    try {
      if (!updatedImage) {
        return res.status(404).send({
          status: "error",
          message: "Failed to update",
        });
      }
      return res.status(200).send({
        status: "success",
        user: updatedImage,
        file: req.file,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Something went wrong!",
      });
    }
  }
};

// Show the avatar image
const avatar = async (req, res) => {
  const {
    params: { file },
  } = req;

  // Path of the image
  const filePath = path.resolve(`./uploads/avatars/${file}`);

  // Check if exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send({
      status: "error",
      message: "The image doesn't exist",
    });
  }

  // Return the file
  return res.status(200).sendFile(filePath);
};

module.exports = {
  userTest,
  register,
  login,
  profile,
  list,
  update,
  upload,
  avatar,
};
