const mongoose = require("mongoose");

// Connection to database with mongoose
const connection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27018/socialNetwork");

    console.log("Connected successfully to database socialNetwork");
  } catch (err) {
    console.log(err);
    throw new Error("Failed to connect to the database");
  }
};

module.exports = connection;