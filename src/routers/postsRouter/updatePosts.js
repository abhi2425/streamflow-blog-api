const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const PostsCollection = require('../../models/postCollection')

//update any field of a post---> only if you r owner of post
router.patch('/profile/post/update/:title', auth, async ({ body, params, user }, res) => {
   const userUpdates = Object.keys(body)
   const allowedUpdates = ['title', 'body', 'viewCount', 'upVote', 'downVote', 'blogImages']
   try {
      const isValidUpdate = userUpdates.every((updates) => allowedUpdates.includes(updates))
      if (!isValidUpdate) {
         const invalidProperty = []
         userUpdates.forEach((key) => {
            if (!allowedUpdates.includes(key)) invalidProperty.push(key)
         })
         return res.status(404).send({
            error: `invalid property-${invalidProperty} is not updated `,
         })
      }
      const post = await PostsCollection.findOne({
         title: params.title.toLowerCase(),
         postOwner: user.userName.toLowerCase(),
      })
      //   const post1 = await PostsCollection.aggregate([
      //      {
      //         $match: {
      //            title: params.title.toLowerCase(),
      //            postOwner: user.userName.toLowerCase(),
      //         },
      //      },
      //   ])
      //   console.log(post1)

      // We can not use save method using aggregate and moreover it return an array of document so we have to go one step down to get the document.

      if (!post) throw new Error('post not found!')
      userUpdates.forEach((update) => (post[update] = body[update]))
      //   userUpdates.forEach((update) => (post1[0][update] = body[update]))
      //   console.log(post1)
      // await post1.save()  --> Not allowed
      await post.save()
      res.status(202).send({ message: `${post.title}  updated successfully!!` })
   } catch (error) {
      res.status(400).send({ error: error.message })
   }
})

//add or update comments in a post
router.patch(
   '/profile/post/:userName/:postTitle/comment',
   auth,
   async ({ body, params, user }, res) => {
      try {
         const post = await PostsCollection.findOne({
            postOwner: params.userName.toLowerCase(),
            title: params.postTitle.toLowerCase(),
         })
         if (!post) throw new Error('post not found!!')
         post.comments = [...post.comments, { ...body, owner: user.userName }]
         await post.save()
         res.status(202).send({ message: 'comment posted!' })
      } catch (error) {
         res.status(404).send({ error: error.message })
      }
   },
)

module.exports = router
