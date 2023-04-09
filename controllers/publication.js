const Publication = require("../models/publication");

const publicationTest = (req, res) => {
  return res.status(200).send({
    message: "Sent message from: controllers/publication.js",
  });
};

// Save publication
const savePublication = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).send({
      status: "error",
      message: "You need to send the text",
    });
  }

  // Create and fill the model object
  let newPublication = new Publication({ text: text });
  newPublication.user = req.user.id;

  // Save the object in database
  try {
    const savedPublication = await newPublication.save();
    return res.status(200).send({
      status: "success",
      message: "Publication was saved",
      publication: savedPublication,
    });
  } catch {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error saving publication",
    });
  }
};

module.exports = {
  publicationTest,
  savePublication,
};
