const db = require("../models");
const User = db.user;

exports.findAll = (req, res) => {
  User.find({}, {username: 1, email: 1, _id: 1})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error retrieving users."
      });
    });
}
