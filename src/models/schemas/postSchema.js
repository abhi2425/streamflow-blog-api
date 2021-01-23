const mongoose = require('mongoose')

const commentsSchema = require('./helperSchemas/commentsSchema')
const blogImageSchema = require('./helperSchemas/blogImageSchema')
const postSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
         trim: true,
         lowercase: true,
         unique: true,
      },
      body: {
         type: String,
         required: true,
      },
      viewCount: {
         type: Number,
         default: 0,
      },
      upVote: {
         type: Number,
         default: 0,
      },
      downVote: {
         type: Number,
         default: 0,
      },
      comments: [commentsSchema],
      blogImages: [blogImageSchema],
      postOwner: {
         type: String,
         required: true,
         ref: 'UsersCollection',
      },
   },
   {
      timestamps: true,
   },
)

module.exports = postSchema
