// Import models
const Follow = require("../models/follow");
const User = require("../models/user");

// Import service
const followService = require("../services/followService");

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
      userToFollow: savedFollow,
    });
  } catch {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error saving follow",
    });
  }
};

// Unfollow action
const unfollow = async (req, res) => {
  const userId = req.user.id;
  const followedId = req.params.id;

  try {
    const followDeleted = await Follow.deleteOne({
      user: userId,
      followed: followedId,
    });
    return res.status(200).send({
      status: "success",
      message: "Follower removed successfully",
      followDeleted,
    });
  } catch {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error deleting follow",
    });
  }
};

// List of users that I'm following
const getFollowingUsers = async (req, res) => {
  let { id: userId, page = 1 } = req.params;
  // Users per page
  const itemsPerPage = 5;

  // Find following user
  try {
    const following = await Follow.paginate(
      { user: userId },
      {
        select: "followed name nick",
        populate: { path: "followed", select: "name nick -_id" },
        page: page,
        limit: itemsPerPage,
      }
    );

    // Get an object with an array of IDs of the users followed by the user with the provided ID.
    let followUsersIds = followService.followUsersId(req.user.id);

    return res.status(200).send({
      status: "success",
      message: "List of users that I'm following",
      following,
      user_following: (await followUsersIds).following,
      user_follow_me: (await followUsersIds).followers,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error getting following users",
    });
  }
};

// List of users who follow me
const getFollowers = async (req, res) => {
  let { id: userId, page = 1 } = req.params;
  // Users per page
  const itemsPerPage = 5;

  try {
    const followers = await Follow.find(
      { followed: userId },
      {
        select: "followed name nick",
        populate: { path: "user followed", select: "name nick -_id" },
        page: page,
        limit: itemsPerPage,
      }
    );

    let followUsersIds = followService.followUsersId(req.user.id);

    return res.json({
      status: "success",
      message: "List of users who follow me",
      followers,
      user_following: (await followUsersIds).following,
      user_follow_me: (await followUsersIds).followers,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error fetching user's followers",
      error: error.message,
    });
  }
};
module.exports = {
  followTest,
  saveFollow,
  unfollow,
  getFollowingUsers,
  getFollowers,
};
