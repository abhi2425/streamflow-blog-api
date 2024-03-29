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
    upVote: [String],
    downVote: [String],
    tags: [String],
    comments: [commentsSchema],
    blogImages: [blogImageSchema],
    postOwner: {
      type: String,
      required: true,
      ref: 'UsersCollection',
    },
    avatar: {
      type: Object,
      ref: 'UsersCollection',
    },
  },
  {
    timestamps: true,
  }
)
postSchema.index(
  { title: 'text', body: 'text', tags: 'text' },
  { weight: { title: 3, body: 5 } }
)

module.exports = postSchema
