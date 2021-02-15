const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')

const userSchema = require('../schemas/userSchema')
const PostsCollection = require('./postCollection')
const deleteImageFromCloudinary = require('../services/cloudinary/deleteFromCloudinary')

// login check for user
userSchema.statics.findByCredential = async (email, password) => {
   try {
      const user = await UsersCollection.findOne({
         email,
      })

      if (!user) {
         throw new Error('E-Mail Not Found!!!')
      }
      const isMatch = await bcryptjs.compare(password, user.password)
      if (!isMatch) {
         throw new Error('Unable To Login')
      }
      return user
   } catch (error) {
      resizeBy.send({ error: error.message })
   }
}

// removes user from followers list
userSchema.statics.removeFromFollowersList = async (id) => {
   const result = await UsersCollection.updateMany(
      {
         'followers.followerId': mongoose.Types.ObjectId(id),
      },
      [
         {
            $set: {
               followers: {
                  $filter: {
                     input: '$followers',
                     as: 'follower',
                     cond: {
                        $ne: ['$$follower.followerId', id],
                     },
                  },
               },
            },
         },
      ],
   )

   return result
}
// generating auth token for user
userSchema.methods.getAuthToken = async function () {
   const token = jwt.sign(
      {
         _id: this._id.toString(),
      },
      process.env.SECRET_KEY,
      {
         expiresIn: '2 days',
      },
   )
   this.tokens = this.tokens.concat({
      token,
   })
   await this.save()
   return token
}
// deleting large data before sending to client --> this method is called implicitly by res.send()
userSchema.methods.toJSON = function () {
   const userObject = this.toObject()
   delete userObject.password
   delete userObject.tokens
   delete userObject.followers
   return userObject
}

// hashing password before saving to db
userSchema.pre('save', async function (next) {
   const user = this
   if (user.isModified('password')) {
      user.password = await bcryptjs.hash(user.password, 12)
   }
   next()
})

// removing profile pic and all posts of user whose account is going to be removed
userSchema.pre('remove', async function (next) {
   const user = this
   if (user.avatar.publicId) {
      const result = await deleteImageFromCloudinary(user.avatar.publicId)
      if (result.result === 'not found') throw new Error('Something went wrong!!')
   }
   await UsersCollection.removeFromFollowersList(user._id)
   const posts = await PostsCollection.find({ postOwner: user.userName })
   for (let post of posts) {
      const { blogImages } = post
      if (blogImages.length !== 0) {
         for (const blogImage of blogImages) {
            const result = await deleteImageFromCloudinary(blogImage.publicId)
            if (result.result === 'not found') throw new Error('no images in this post')
         }
      }
   }

   await PostsCollection.deleteMany({
      postOwner: user.userName,
   })
   next()
})
const UsersCollection = mongoose.model('UsersCollection', userSchema)
module.exports = UsersCollection
