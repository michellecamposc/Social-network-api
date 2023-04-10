const validator = require("validator");

const validate = (params) => {
  const errors = [];

  if (!params.name || !validator.isLength(params.name, { min: 4 })) {
    errors.push("Name must be at least 4 characters long.");
  } else if (!validator.isAlpha(params.name)) {
    errors.push("Name must only contain letters.");
  }

  if (!params.surname || !validator.isLength(params.surname, { min: 4 })) {
    errors.push("Surname must be at least 4 characters long.");
  } else if (!validator.isAlpha(params.surname)) {
    errors.push("Surname must only contain letters.");
  }

  if (!params.nick || !validator.isLength(params.nick, { min: 3 })) {
    errors.push("Nick must be at least 3 characters long.");
  }

  if (!params.email || !validator.isEmail(params.email)) {
    errors.push("Invalid email address.");
  }

  if (!params.password || !validator.isLength(params.password, { min: 5 })) {
    errors.push("Password must be at least 5 characters long.");
  }

  if (params.bio && !validator.isLength(params.bio, { max: 255 })) {
    errors.push("Bio must not exceed 255 characters.");
  }

  return errors;
};

module.exports = validate;
