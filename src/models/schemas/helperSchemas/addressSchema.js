const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
   country: {
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
