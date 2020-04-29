const db = require("../models");
const User = db.user;

exports.findAll = (req, res) => {
  User.find({}, {firstname: 0, lastname: 0, phone: 0, password: 0, __v: 0})
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

exports.findAll2 = (req, res) => {
  User.find({}, {_id: 0, firstname: 0, lastname: 0, email:0, phone: 0, password: 0, __v: 0})
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

exports.findAll3 = (req, res) => {
  User.find({}, {_id: 0, firstname: 0, lastname: 0, phone: 0, password: 0, __v: 0})
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
