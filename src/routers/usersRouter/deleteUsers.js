const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const deleteImageFromCloudinary = require('../../utils/deleteFromCloudinary')

// delete a user along with it's profile pic and it's link to all post or followers
router.delete('/profile/user/me', auth, async ({ user }, res) => {
   try {
      const removedUser = await user.remove()
      return res
         .status(202)
         .send({ message: `${removedUser.name}'s account deleted permanently!!` })
   } catch (error) {
      res.status(500).send({ error: error.message })
   }
})

//delete any pic either of your post or profile
router.delete('/profile/me/delete/:publicId', auth, async ({ params, user }, res) => {
   try {
      const result = await deleteImageFromCloudinary(params.publicId)
      if (result.result !== 'not found') {
         user.avatar = null
         await user.save()
         return res.status(202).send(result)
      } else throw new Error('profile image not found!')
   } catch (error) {
      res.status(404).send({ error: error.message })
   }
})
module.exports = router
