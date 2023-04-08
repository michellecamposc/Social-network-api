// Import models
const Follow = require("../models/follow");
const User = require("../models/user");

const followTest = (req, res) => {
  return res.status(200).send({
    message: "Sent message from: controllers/follow.js",
  });
};

// Follow action
const saveFollow = async (req, res) => {
  const { followed } = req.body;
  // id of the identified user
  const identity = req.user;

  let userToFollow = new Follow({
    user: identity.id,
    followed,
  });

  try {
    const savedFollow = await userToFollow.save();
    return res.status(200).send({
      status: "success",
      identity,
      userToFollow: savedFollow
    });
  } catch {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error saving follow",
    });
  }
};

module.exports = {
  followTest,
  saveFollow,
};
