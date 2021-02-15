const mongoose = require('mongoose')

const workSchema = new mongoose.Schema({
   _id: false,
   description: {
      type: String,
      required: true,
   },
   startedIn: {
      type: String,
      required: true,
   },
})
module.exports = workSchema
