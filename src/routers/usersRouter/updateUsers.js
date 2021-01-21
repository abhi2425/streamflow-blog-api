const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

router.patch('/users/me', auth, async ({ body, user }, res) => {
   const userUpdates = Object.keys(body)
   const allowedUpdates = [
      'name',
      'userName',
      'buildType',
      'age',
      'status',
      'quotes',
      'password',
      'avatar',
      'interests',
      'socialMedia',
      'eduQualification',
      'currentlyWorking',
      'address',
      'followers',
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
         return res.status(404).send(`Error:- Invalid Property- ${invalidProperty} is Not Updated `)
      }

      userUpdates.forEach((update) => {
         user[update] = body[update]
      })
      await user.save()
      res.status(200).send({
         message: `${user.name}'s account updated successfully!!`,
      })
   } catch (error) {
      res.status(500).send(error.message)
   }
})

module.exports = router
