const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConfig = require('./src/app/config/db.config');
const db = require('./src/app/models');
const Role = db.role;

var corsOptions = {
  origin: "http://localhost:8081"
};

// Connecting with mongo db
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
  useNewUrlParser: true,
  useFindAndModify: false
}).then(() => {
  console.log('Database sucessfully connected');
  initial();
},
error => {
  console.log('Database could not connected: ' + error)
  }
)

// Setting up port with express js
const eventRoute = require('./src/app/routes/event.routes');
const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'dist/eventplanner')));
app.use('/', express.static(path.join(__dirname, 'dist/eventplanner')));
app.use('/eventapi', eventRoute)

/* simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Jey application." });
}); */

// routes
require('./src/app/routes/auth.routes')(app);
require('./src/app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// error handler
app.use(function (err, res) {
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
