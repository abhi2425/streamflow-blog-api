const mongoose = require('mongoose')

const commentsSchema = mongoose.Schema({
   _id: false,
   owner: {
      type: String,
      required: true,
   },
   description: String,
   upVote: {
      type: Number,
      default: 0,
   },
   downVote: {
      type: Number,
      default: 0,
   },
   date: {
      type: Date,
      default: Date.now(),
   },
})
module.exports = commentsSchema
