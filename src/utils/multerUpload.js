const multer = require('multer')

const uploadImage = multer({
   limits: {
      fileSize: 2000000,
   },
   fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(png|PNG|jpg|JPG|jpeg|JPEG|svg)$/)) {
         return cb(new Error('Please Upload image file only'))
      }
      //Another Way to check for file extensions
      // const ext = path.extname(file.originalname)  //path module
      // console.log(ext)
      // if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      //    return cb(new Error('Only images are allowed'))
      // }
      cb(undefined, true)
   },
})
module.exports = uploadImage
