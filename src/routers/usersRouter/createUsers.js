const express = require('express')
const router = express.Router()
const UsersCollection = require('../../models/usersCollection')
const auth = require('../../middlewares/auth')

router.post('/signup', async ({ body }, res) => {
   try {
      body.userName = body.userName.replace(/\s/g, '-')
      const user = new UsersCollection(body)
      await user.save()
      const token = await user.getAuthToken()

      res.status(201).send({
         user,
         token,
      })
   } catch (error) {
      res.status(500).send(error.message)
   }
})
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
router.post('/user/logout', auth, async ({ user, token }, res) => {
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
router.post('/user/logoutAll', auth, ({ user }, res) => {
   try {
      user.tokens = []
      user.save()
      res.status(201).send({
         message: user.name + ' Logged Out From All Devices!!',
      })
   } catch (error) {
      res.status(500).send({
         error: error.message,
      })
   }
})
module.exports = router
