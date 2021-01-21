const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
         trim: true,
         lowercase: true,
      },
      body: {
         type: String,
         required: true,
      },
      viewCount: Number,
      upVote: Number,
      downVote: Number,
      comments: [
         {
            owner: {
               type: mongoose.Schema.Types.ObjectId,
               required: true,
            },
            description: String,
            upVote: Number,
            downVote: Number,
            date: Date,
         },
      ],
      blogImages: [
         {
            image: {
               type: Buffer,
            },
         },
      ],
      postOwner: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'UsersCollection',
      },
   },
   {
      timestamps: true,
   },
)
module.exports = postSchema
