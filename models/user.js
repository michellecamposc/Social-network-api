const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
  },
  nick: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "role_user",
  },
  image: {
    type: String,
    default: "default.png",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Add pagination plugin to UserSchema
UserSchema.plugin(mongoosePaginate);


//Export module
module.exports = model("User", UserSchema, "users");