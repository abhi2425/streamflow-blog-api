const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const PostsCollection = require('../../models/postCollection')

router.delete('/profile/post/delete/:title', auth, async ({ user, params }, res) => {
   try {
      const post = await PostsCollection.findOne({
         postOwner: user.userName,
         title: params.title,
      })
      const deletedPost = await post.remove()
      if (!post) throw new Error('Posts not found!!')
      return res
         .status(200)
         .send({ message: `${user.name}'s '${deletedPost.title}' deleted successfully!!` })
   } catch (error) {
      res.status(404).send('Error-: ' + error.message)
   }
})

router.delete('/profile/posts/deleteAll', auth, async ({ user }, res) => {
   try {
      const posts = await PostsCollection.deleteMany({ postOwner: user.userName })
      if (posts.deletedCount === 0) throw new Error('Posts not found!!')
      return res.status(200).send({ message: `${user.name}'s all posts deleted successfully!!` })
   } catch (error) {
      res.status(500).send('Error-: ' + error.message)
   }
})
module.exports = router
