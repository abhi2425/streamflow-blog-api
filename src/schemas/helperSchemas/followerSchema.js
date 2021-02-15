const mongoose = require('mongoose')

const followersSchema = mongoose.Schema({
   followerId: {
      _id: false,
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'UserCollection',
   },
})

module.exports = followersSchema
