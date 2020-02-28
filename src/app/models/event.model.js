const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Event = new Schema({
   name: {
      type: String
   },
   description: {
      type: String
   },
   address: {
      type: String
   },
   drinkName: {
      type: String
   },
   drinkSize: {
     type: Number
   }
}, {
   collection: 'events'
})

module.exports = mongoose.model('Event', Event)
