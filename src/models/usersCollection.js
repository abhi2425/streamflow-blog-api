require('dotenv').config()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const userSchema = require('./schemas/userSchema')

userSchema.statics.findByCredential = async (email, password) => {
   const user = await UsersCollection.findOne({
      email,
   })

   if (!user) {
      throw new Error('E-Mail Not Found!!!')
   }
   const isMatch = bcryptjs.compare(password, user.password)
   if (!isMatch) {
      throw new Error('Unable To Login')
   }
   return user
}

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
userSchema.methods.toJSON = function () {
   const userObject = this.toObject()
   delete userObject.password
   delete userObject.tokens
   delete userObject.avatar
   delete userObject.followers
   return userObject
}
userSchema.methods.filterWhileSending = function () {
   const userObject = this.toObject()
   delete userObject.password
   delete userObject.tokens
   delete userObject.avatar
   delete userObject.followers
   return userObject
}
userSchema.pre('save', async function (next) {
   const user = this
   if (user.isModified('password')) {
      user.password = await bcryptjs.hash(user.password, 12)
   }
   next()
})

const UsersCollection = mongoose.model('UsersCollection', userSchema)

module.exports = UsersCollection
