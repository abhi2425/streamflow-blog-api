const mongoose = require('mongoose')
const validator = require('validator')
const educationSchema = require('./helperSchemas/educationSchema')
const workSchema = require('./helperSchemas/workSchema')
const addressSchema = require('./helperSchemas/addressSchema')
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
      buildType: {
         type: String,
         required: true,
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
               //required: true,
            },
         },
      ],
      avatar: {
         type: Buffer,
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
      followers: [
         {
            followerId: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'UserCollection',
            },
         },
      ],
      // followings: [
      //    {
      //       followingId: {
      //          type: mongoose.Schema.Types.ObjectId,
      //          ref: 'UsersCollection',
      //       },
      //    },
      // ],
   },
   {
      timestamps: true,
   },
)
module.exports = userSchema
