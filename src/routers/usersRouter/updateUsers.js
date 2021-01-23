const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const UsersCollection = require('../../models/usersCollection')

//update any fields of user
router.patch('/profile/user/me', auth, async ({ body, user }, res) => {
   const userUpdates = Object.keys(body)
   const allowedUpdates = [
      'name',
      'userName',
      'buildType',
      'age',
      'status',
      'quotes',
      'password',
      'interests',
      'socialMedia',
      'eduQualification',
      'currentlyWorking',
      'address',
   ]
   const isValidUpdate = userUpdates.every((updates) => allowedUpdates.includes(updates))
   try {
      if (!isValidUpdate) {
         const invalidProperty = []
         userUpdates.forEach((key) => {
            if (!allowedUpdates.includes(key)) {
               invalidProperty.push(key)
            }
         })
         return res
            .status(404)
            .send({ error: `Error:- invalid property- ${invalidProperty} is not updated ` })
      }

      userUpdates.forEach((update) => {
         user[update] = body[update]
      })
      await user.save()
      res.status(202).send({
         message: `${user.name}'s account updated successfully!`,
      })
   } catch (error) {
      res.status(500).send(error.message)
   }
})

// follow or unfollow a user
router.patch('/profile/user/:userName/followOrUnfollow', auth, async ({ params, user }, res) => {
   try {
      const userName = params.userName.toLowerCase()
      const userFound = await UsersCollection.findOne({ userName }, { followers: 1 })
      if (!userFound) throw new Error('user not found!')

      const isFollower = userFound.followers.find(
         (_) => JSON.stringify(_.followerId) === JSON.stringify(user._id),
      )

      if (isFollower) {
         userFound.followers = userFound.followers.filter(
            (_) => JSON.stringify(_.followerId) !== JSON.stringify(user._id),
         )
         await userFound.save()
         return res.status(202).send({ message: `you unfollowed ${userName}` })
      }

      if (user.userName !== userName && !isFollower) {
         userFound.followers = [...userFound.followers, { followerId: user._id }]
         await userFound.save()
         return res.status(202).send({ message: 'you followed ' + userName })
      } else throw new Error('you can not follow yourself!')
   } catch (error) {
      res.status(400).send({ error: error.message })
   }
})

// remove your unwanted follower
router.patch('/profile/user/remove/:userName', auth, async ({ params, user }, res) => {
   try {
      const data = await UsersCollection.findOne(
         { userName: params.userName },
         { _id: 1, userName: 1 },
      )
      if (!data) throw new Error('user not found!')

      const result = await UsersCollection.removeFromFollowersList(data._id)
      if (result.nModified === 0) throw new Error(`${data.userName} is not your follower!`)

      res.status(202).send({ message: `${data.userName} is removed from your follower's list` })
   } catch (error) {
      res.status(404).send({
         error: error.message,
      })
   }
})

module.exports = router
