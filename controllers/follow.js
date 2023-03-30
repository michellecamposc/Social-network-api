const followTest = (req, res) => {
  return res.status(200).send({
    message: "Sent message from: controllers/follow.js"
  });
}

module.exports = {
  followTest
}