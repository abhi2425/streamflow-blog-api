const mongoose = require('mongoose')

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
      comments: [
         {
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
         },
      ],
      blogImages: [
         {
            _id: false,
            image: {
               type: String,
               required: true,
            },
            publicId: {
               type: String,
               required: true,
            },
         },
      ],
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
