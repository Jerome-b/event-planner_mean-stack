const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConfig = require('./src/app/config/db.config');

var corsOptions = {
  origin: "http://localhost:8081"
};

// Connecting with mongo db
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Database sucessfully connected');
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'dist/eventplanner')));
app.use('/', express.static(path.join(__dirname, 'dist/eventplanner')));
app.use('/eventapi', eventRoute)

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

