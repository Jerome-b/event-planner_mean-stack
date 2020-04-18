const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Event = new Schema({
  owner: { type: String },
  name: { type: String },
  date: { type: String },
  time: { type: String},
  description: { type: String },
  address: { type: String },
  },
  {
    collection: 'events',
    // allow dynamic change of the model
    strict: false
  }
)

module.exports = mongoose.model('Event', Event)
