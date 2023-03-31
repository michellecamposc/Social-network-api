const connection = require("./database/connection");
const express = require("express")
const cors = require("cors")

//Database connection
console.log("Node API for social Network initialized");
connection();

// Create node server
const app = express();
const port = 3000;

// Cors config
app.use(cors());

// Convert the data of the body to json objects
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load routes
const userRoute = require("./routes/user");
const publicationRoute = require("./routes/publication");
const followRoute = require("./routes/follow");

app.use("/api/user", userRoute);
app.use("/api/publication", publicationRoute);
app.use("/api/follow", followRoute);


// Listening to http requests
app.listen(port, () => {
  console.log("Node server", port);
})