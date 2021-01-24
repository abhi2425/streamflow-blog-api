const express = require('express')
const sharp = require('sharp')
const router = express.Router()

const UsersCollection = require('../../models/usersCollection')
const auth = require('../../middlewares/auth')
const uploadImage = require('../../utils/multerUpload')
const sendEmailOnSigningIn = require('../../utils/sendEmail')
const uploadToCloudinaryByStreams = require('../../utils/uploadToCloudinary')

// create a user and add a token for surfing around
router.post('/signup', async ({ body }, res) => {
   try {
      body.userName = body.userName.replace(/\s/g, '-')
      const user = new UsersCollection(body)
      await user.save()
      const token = await user.getAuthToken()
      await sendEmailOnSigningIn(
         body.email,
         `Hii, ${body.name},Thanks for joining us please let me know how I can help you to enhance your experience here.`,
      )
      res.status(201).send({
         user,
         token,
      })
   } catch (error) {
      res.status(500).send({ error: error.message })
   }
})
//login user and give them a token to use restricted routes
router.post('/login', async ({ body }, res) => {
   try {
      const user = await UsersCollection.findByCredential(body.email, body.password)
      const token = await user.getAuthToken()
      res.status(200).send({
         user,
         token,
      })
   } catch (error) {
      res.status(404).send(error.message)
   }
})

// logout from current device
router.post('/profile/user/logout', auth, async ({ user, token }, res) => {
   try {
      user.tokens = user.tokens.filter((tokenObj) => tokenObj.token !== token)
      await user.save()
      res.status(200).send({
         message: user.name + ' Logged Out!!',
      })
   } catch (error) {
      res.status(500).send({
         error: error.message,
      })
   }
})

// logout user from all the devices
router.post('/profile/user/logoutAll', auth, ({ user }, res) => {
   try {
      user.tokens = []
      user.save()
      res.status(200).send({
         message: user.name + ' Logged Out From All Devices!!',
      })
   } catch (error) {
      res.status(500).send({
         error: error.message,
      })
   }
})

// upload or update profile picture
router.post(
   '/profile/me/avatar',
   auth,
   uploadImage.single('avatar'),
   async ({ file, user }, res) => {
      const buffer = await sharp(file.buffer)
         .png()
         .resize({
            width: 400,
            height: 400,
         })
         .toBuffer()

      const result = await uploadToCloudinaryByStreams(buffer)
      user.avatar = {
         image: result.secure_url,
         publicId: result.public_id,
      }
      await user.save()

      res.status(200).send({
         message: 'image uploaded!',
         url: result.secure_url,
         publicId: result.public_id,
      })
   },
   (error, _, res, next) => {
      res.status(400).send({
         error: error.message,
      })
   },
)

module.exports = router
