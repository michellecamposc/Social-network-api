const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const FollowSchema = Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
  },
  followed: {
    type: Schema.ObjectId,
    ref: "User",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Add pagination plugin to FollowSchema
FollowSchema.plugin(mongoosePaginate);

// Export module
module.exports = model("Follow", FollowSchema, "follows");