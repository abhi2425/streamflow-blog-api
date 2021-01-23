const mongoose = require('mongoose')
const postSchema = require('./schemas/postSchema')
const deleteImageFromCloudinary = require('../utils/deleteFromCloudinary')

// removing blogImages from cloudinary on removing a particular post by authorized user
postSchema.pre('remove', async function (next) {
   const post = this
   const { blogImages } = post
   if (blogImages.length !== 0) {
      for (const blogImage of blogImages) {
         const result = await deleteImageFromCloudinary(blogImage.publicId)
         if (result.result === 'not found') throw new Error('no images in this post')
      }
   }
   next()
})

const PostsCollection = mongoose.model('PostsCollection', postSchema)

module.exports = PostsCollection
