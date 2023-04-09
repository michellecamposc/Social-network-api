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
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error saving publication",
    });
  }
};

// Show publication
const detail = async (req, res) => {
  const publicationId = req.params.id;

  try {
    const publication = await Publication.findById(publicationId);
    return res.status(200).send({
      status: "success",
      message: "Post details displayed",
      publication,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error retrieving publication details",
    });
  }
};


// Delete publication
const remove = async (req, res) => {
  const publicationId = req.params.id;
  const userId = req.user.id;

  // Find and delete the publication
  try {
    const deletedPublication = await Publication.deleteOne({
      _id: publicationId,
      user: userId,
    });

    // If publication doesn't exist
    if (deletedPublication.deletedCount === 0) {
      return res.status(404).send({
        status: "error",
        message: "Publication not found",
      });
    }
    // Return the result
    return res.status(200).send({
      status: "success",
      message: "Publication was deleted",
      deletedPublicationId: publicationId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error deleting publication",
    });
  }
};

module.exports = {
  publicationTest,
  savePublication,
  detail,
  remove,
};
