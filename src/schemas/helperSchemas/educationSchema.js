const mongoose = require('mongoose')

const educationSchema = new mongoose.Schema({
   _id: false,
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
      type: String,
      required: true,
   },
})

module.exports = educationSchema
