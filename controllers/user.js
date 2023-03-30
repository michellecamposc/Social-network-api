const userTest = (req, res) => {
  return res.status(200).send({
    message: "Sent message from: controllers/user.js"
  });
}

module.exports = {
  userTest
}