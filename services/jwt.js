const jwt = require("jwt-simple");
const moment = require("moment");

// Secret password to codify the token
const secret = "KEY_SECRET_of_project_social_media_987789";

// Function to generate token
const createToken = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    surname: user.surname,
    nick: user.nick,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(),
    exp: moment().add(30, "days").unix(),
  };

  // Return encoded token
  return jwt.encode(payload, secret);
};

module.exports = {
  secret,
  createToken,
};
