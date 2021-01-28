const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
   _id: false,
   country: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
   },
   state: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
   },
   city: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
   },
   pinCode: {
      type: Number,
      required: true,
   },
})
module.exports = addressSchema
