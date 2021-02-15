const mongoose = require('mongoose')

const blogImageSchema = mongoose.Schema({
   _id: false,
   image: {
      type: String,
      required: true,
   },
   publicId: {
      type: String,
      required: true,
   },
})

module.exports = blogImageSchema
