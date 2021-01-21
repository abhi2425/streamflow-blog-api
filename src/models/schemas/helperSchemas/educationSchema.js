const mongoose = require('mongoose')

const educationSchema = new mongoose.Schema({
   institution: {
      type: String,
      required: true,
   },
   name: {
      type: String,
      required: true,
   },
   subject: {
      type: String,
      required: true,
   },
   score: {
      type: String,
      required: true,
   },
   completed: {
      type: Boolean,
      required: true,
   },
   yearOfCompletion: {
      type: Number,
      required: true,
   },
})

module.exports = educationSchema
