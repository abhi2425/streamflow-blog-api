const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const PostsCollection = require('../../models/postCollection')
router.post('/profile/post/create', auth, async ({ user, body }, res) => {
   body.title = body.title.replace(/\s/g, '-')
   try {
      const post = await PostsCollection({
         postOwner: user.userName,
         ...body,
      })
      await post.save()
      res.status(201).send(post)
   } catch (error) {
      res.status(500).send(error.message)
   }
})

module.exports = router
