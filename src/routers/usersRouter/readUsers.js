const express = require('express')
const router = express.Router()
const UsersCollection = require('../../models/usersCollection')

router.get('/users', async (_, res) => {
   try {
      const users = await UsersCollection.find({})
      res.status(200).send(users)
   } catch (error) {
      res.status(500).send(error.message)
   }
})

router.get('/user/:userName', async (req, res) => {
   try {
      const user = await UsersCollection.aggregate([
         {
            $match: { userName: req.params.userName },
         },
      ])
      res.status(200).send(user)
   } catch (error) {
      res.status(500).send(error.message)
   }
})

module.exports = router
