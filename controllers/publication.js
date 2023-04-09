const Publication = require("../models/publication");

const publicationTest = (req, res) => {
  return res.status(200).send({
    message: "Sent message from: controllers/publication.js"
  });
}






module.exports = {
  publicationTest
}