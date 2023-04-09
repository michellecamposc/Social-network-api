const Follow = require("../models/follow");

// Find the users followed by a given user and returns an object
const followUsersId = async (identityUserId) => {
  try {
    let following = await Follow.find({
      user: identityUserId,
    }).select("followed");

    let followers = await Follow.find({
      followed: identityUserId,
    }).select("user");

    /* Process array of ids
    let followingClean = [];
    following.forEach((follow) => {
      followingClean.push(follow.followed);
    });

    let followersClean = [];
    followers.forEach((follow) => {
      followersClean.push(follow.user);
    });*/

    return { following, followers };
  } catch (error) {
    throw new Error("Error fetching user's followers and followings");
  }
};

const followThisUser = async (identityUserId, profileUserId) => {
  let following = await Follow.findOne({
    user: identityUserId,
    followed: profileUserId,
  });

  let followers = await Follow.findOne({
    user: profileUserId,
    followed: identityUserId,
  });

  return { following, followers };
};

module.exports = {
  followUsersId,
  followThisUser,
};
