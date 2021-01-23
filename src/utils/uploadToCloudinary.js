const cloudinary = require('./cloudinaryConfig')
const streamifier = require('streamifier')

// cloudinary upload
const uploadToCloudinaryByStreams = (buffer) => {
   return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
         if (result) {
            resolve(result)
         } else {
            reject(error)
         }
      })

      streamifier.createReadStream(buffer).pipe(stream)
   })
}
module.exports = uploadToCloudinaryByStreams
