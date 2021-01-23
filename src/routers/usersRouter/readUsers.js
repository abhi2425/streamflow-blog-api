const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const UsersCollection = require('../../models/usersCollection')

//get all the users
router.get('/users', async (_, res) => {
   try {
      const users = await UsersCollection.find({})
      res.status(200).send(users)
   } catch (error) {
      res.status(500).send(error.message)
   }
})
// get any user by userName
router.get('/user/:userName', async ({ params }, res) => {
   try {
      const user = await UsersCollection.findOne({ userName: params.userName.toLowerCase() })
      //const user = await UsersCollection.aggregate([{ $match: { userName: params.userName } }])

      //aggregate--> return array of docs which u have to manually filter password,tokens and rest off stuff u don't wanna send
      if (!user) throw new Error('User not Found!!')
      return res.status(200).send(user)
   } catch (error) {
      res.status(404).send(error.message)
   }
})

//get following list of a user
router.get('/user/:userName/following', async ({ params }, res) => {
   try {
      const user = await UsersCollection.findOne(
         { userName: params.userName.toLowerCase() },
         { _id: 1 },
      )
      if (!user) throw new Error('user not found!')
      const following = await UsersCollection.aggregate([
         { $match: { 'followers.followerId': mongoose.Types.ObjectId(user._id) } },
         {
            $project: {
               userName: 1,
               name: 1,
               status: 1,
               currentlyWorking: 1,
               _id: 0,
            },
         },
      ])
      res.status(200).send(following)
   } catch (error) {
      res.status(404).send(error.message)
   }
})

const getUserByFilter = async (filter, userName) => {
   if (filter === 'password') throw new Error(`don't try to be smart😁`)
   if (filter === 'tokens') throw new Error(`don't try to be smart😁`)

   if (filter === 'followers') {
      const idOfFollowers = await UsersCollection.aggregate([
         { $match: { userName } },
         { $project: { list: `$${filter}`, _id: 0 } },
      ])
      const followersId = [...idOfFollowers[0].list]
      const followersList = []
      for (const _ of followersId) {
         const follower = await UsersCollection.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(_.followerId) } },
            {
               $project: {
                  userName: 1,
                  name: 1,
                  status: 1,
                  currentlyWorking: 1,
                  _id: 0,
               },
            },
         ])
         followersList.push(...follower)
      }
      return followersList
   }
   const userField = await UsersCollection.aggregate([
      { $match: { userName } },
      {
         $project: {
            data: `$${filter}`,
            _id: 0,
         },
      },
   ])
   if (Object.keys(userField[0]).length === 0) throw new Error('incorrect query!')
   return userField
}
// get any field of a user   //----> can use it to find followers list a user
router.get('/user/:userName/:filter', async ({ params }, res) => {
   try {
      const userField = await getUserByFilter(params.filter, params.userName.toLowerCase())
      return res.status(200).send(userField)
   } catch (error) {
      res.status(404).send({ error: error.message })
   }
})

module.exports = router
