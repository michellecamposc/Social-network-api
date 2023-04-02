const jwt = require("jwt-simple");
const moment = require("moment");

//Import secret password
const libjwt = require("../services/jwt");
const secret = libjwt.secret;

// Middleware Auth
exports.auth = (req, res, next) => {
  // Check if return authentication header
  if (!req.headers.authorization) {
    return res.status(403).send({
      status: "error",
      message: "The request doesn't have the authentication header",
    });
  }

  // Clear token
  let token = req.headers.authorization.replace(/['"]+/g, "");

  // Decode token
  try {
    let payload = jwt.decode(token, secret);
    // Check token expiration
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        status: "error",
        message: "Expired token",
      });
    }

    // Add user data to request
    req.user = payload;

  } catch (error) {
    return res.status(404).send({
      status: "error",
      message: "Invalid token",
      error,
    });
  }

  // Go to action execution
  next();
};
