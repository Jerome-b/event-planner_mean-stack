const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Event = new Schema({
  name: { type: String },
  date: { type: String },
  time: { type: String},
  description: { type: String },
  address: { type: String },
  },
  {
    collection: 'events',
    strict: false
  }
)

module.exports = mongoose.model('Event', Event)
