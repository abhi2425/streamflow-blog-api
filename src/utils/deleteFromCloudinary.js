const cloudinary = require('./cloudinaryConfig')

const deleteImageFromCloudinary = (publicId) => {
   return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, async (error, result) => {
         if (result) {
            resolve(result)
         } else {
            reject(error)
         }
      })
   })
}
module.exports = deleteImageFromCloudinary
