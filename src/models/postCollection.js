const mongoose = require('mongoose')
const postSchema = require('./schemas/postSchema')

const PostsCollection = mongoose.model('PostsCollection', postSchema)

module.exports = PostsCollection
