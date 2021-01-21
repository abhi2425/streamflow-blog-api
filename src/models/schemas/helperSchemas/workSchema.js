const mongoose = require('mongoose')

const workSchema = new mongoose.Schema({
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
