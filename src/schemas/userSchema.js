const mongoose = require('mongoose')
const validator = require('validator')

const educationSchema = require('./helperSchemas/educationSchema')
const workSchema = require('./helperSchemas/workSchema')
const addressSchema = require('./helperSchemas/addressSchema')
const followersSchema = require('./helperSchemas/followerSchema')
const userSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
         lowercase: true,
      },
      userName: {
         type: String,
         required: true,
         lowercase: true,
         trim: true,
         unique: true,
      },
      birthday: {
         type: String,

         lowercase: true,
         trim: true,
      },
      age: {
         type: Number,
         default: 0,
         required: true,
         validate(value) {
            if (value < 0) {
               throw new Error('Age can not be negative')
            }
         },
      },
      gender: {
         type: String,
      },
      status: {
         type: String,
         lowercase: true,
         trim: true,
      },
      quotes: {
         type: String,
         lowercase: true,
         trim: true,
      },
      viewCount: Number,
      email: {
         type: String,
         required: true,
         trim: true,
         unique: true,
         validate(value) {
            if (!validator.isEmail(value)) {
               throw new Error('Not Valid Email!!')
            }
         },
      },
      password: {
         required: true,
         type: String,
         trim: true,
         validate(value) {
            if (value.length < 8) {
               throw new Error('Password Must be greater Than 7 Characters')
            } else if (value.toLowerCase().includes('password')) {
               throw new Error("password word can't set to password")
            }
         },
      },
      tokens: [
         {
            token: {
               type: String,
               required: true,
            },
         },
      ],
      avatar: {
         image: String,
         publicId: String,
      },
      interests: {
         type: [String],
         lowercase: true,
         trim: true,
      },
      socialMedia: {
         type: [String],
         trim: true,
      },
      eduQualification: {
         type: educationSchema,
      },
      currentlyWorking: {
         type: workSchema,
      },
      address: {
         type: addressSchema,
      },
      followers: [followersSchema],
   },
   {
      timestamps: true,
   },
)
userSchema.index(
   {
      name: 'text',
      userName: 'text',
      email: 'text',
      interests: 'text',
      quotes: 'text',
      gender: 'text',
      buildType: 'text',
   },
   {
      weight: {
         name: 3,
         userName: 3,
         email: 7,
         interests: 3,
         quotes: 6,
         buildType: 3,
      },
   },
)

module.exports = userSchema
